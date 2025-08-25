import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { CadastrarPeriodicoSchema } from '../schemas/CadastrarPeriodicoSchema';
import useAreas from '../hooks/useAreas';
import { useNavigate } from 'react-router-dom';
import { MultiSelectDropdown } from './MultipleSelectDropdown';
import {
  calcularClassificacaoPeriodico,
  calcularClassificacaoPorQualis,
  calcClassEventoSemSBC,
} from '../utils/classificacaoBase';
import { useState } from 'react';
import React from 'react';

function FormularioPeriodicoContent() {
  const areas = useAreas();
  const navigate = useNavigate();

  const [isEnableSBC, setIsEnableSBC] = useState(false);
  const [hasQualisSelected, setHasQualisSelected] = useState(false);
  const [hasH5OrGoogleScholar, setHasH5OrGoogleScholar] = useState(false);

  const methods = useForm({
    resolver: zodResolver(CadastrarPeriodicoSchema),
  });

  const {
    handleSubmit,
    register,
    setValue,
    control,
    watch,
    formState: { errors },
  } = methods;

  const qualisValue = watch('qualisAntigo');
  const h5Value = watch('h5');
  const googleScholarValue = watch('linkGoogleScholar');
  const linkJcrValue = watch('linkJcr');
  const linkScopusValue = watch('linkScopus');

  // Update hasQualisSelected state when qualisValue changes
  React.useEffect(() => {
    const hasQualis = qualisValue && qualisValue !== '';
    setHasQualisSelected(hasQualis);

    // Clear H5 and Google Scholar when Qualis is selected
    if (hasQualis) {
      setValue('h5', '');
      setValue('linkGoogleScholar', '');
    }
  }, [qualisValue, setValue]);

  // Update hasH5OrGoogleScholar state when h5 or googleScholar changes
  React.useEffect(() => {
    const hasH5 = h5Value && h5Value !== '';
    const hasGoogleScholar = googleScholarValue && googleScholarValue !== '';
    const hasEither = hasH5 || hasGoogleScholar;
    setHasH5OrGoogleScholar(hasEither);

    // Clear Qualis when H5 or Google Scholar is filled
    // But only if H5 is filled (since Google Scholar now depends on having a value)
    if (hasH5) {
      setValue('qualisAntigo', '');
    }
  }, [h5Value, googleScholarValue, setValue]);

  // Clear percentil JCR when linkJcr is empty
  React.useEffect(() => {
    if (!linkJcrValue || linkJcrValue === '') {
      setValue('percentilJcr', '');
    }
  }, [linkJcrValue, setValue]);

  // Clear percentil Scopus when linkScopus is empty
  React.useEffect(() => {
    if (!linkScopusValue || linkScopusValue === '') {
      setValue('percentilScopus', '');
    }
  }, [linkScopusValue, setValue]);

  // Clear H5 when Google Scholar is empty
  React.useEffect(() => {
    if (!googleScholarValue || googleScholarValue === '') {
      setValue('h5', '');
    }
  }, [googleScholarValue, setValue]);

  const onSubmit = data => {
    // Handle vinculoSbc logic and convert percentil strings to numbers for calculation
    const { vinculoSbcCheckbox: _, ...rest } = data; // Remove vinculoSbcCheckbox

    // Convert percentile strings to numbers for classification calculation
    const percentilJcrNum =
      parseFloat((data.percentilJcr || '0').replace(',', '.')) || 0;
    const percentilScopusNum =
      parseFloat((data.percentilScopus || '0').replace(',', '.')) || 0;
    const h5Value = data.h5 ? Number(data.h5.toString().replace(',', '.')) : 0;

    let classificacao;

    // Priority order: H5 > Percentil > Qualis Antigo
    if (h5Value && h5Value > 0) {
      // Use H5 for classification (same as periodico percentil logic)
      classificacao = calcClassEventoSemSBC(h5Value);
    } else if (percentilJcrNum > 0 || percentilScopusNum > 0) {
      // Use percentil for classification
      classificacao = calcularClassificacaoPeriodico(
        Math.max(percentilJcrNum, percentilScopusNum)
      );
    } else if (data.qualisAntigo && data.qualisAntigo !== '') {
      // Use antigo qualis for classification
      classificacao = calcularClassificacaoPorQualis(data.qualisAntigo);
    } else {
      // Default classification
      classificacao = 'a8';
    }

    const periodicoData = {
      ...rest,
      vinculoSbc: data.vinculoSbcCheckbox ? 'vinculo_comum' : 'sem_vinculo',
      classificacao: classificacao,
    };

    console.log('Submitting periodico data:', periodicoData);
    navigate('/validacao-cadastro', {
      state: periodicoData,
    });
  };

  const qualisOptions = [
    { value: 'a1', label: 'A1' },
    { value: 'a2', label: 'A2' },
    { value: 'a3', label: 'A3' },
    { value: 'a4', label: 'A4' },
    { value: 'b1', label: 'B1' },
    { value: 'b2', label: 'B2' },
    { value: 'b3', label: 'B3' },
    { value: 'b4', label: 'B4' },
  ];

  return (
    <>
      {' '}
      <div className="max-w-6xl mx-auto mt-4">
        <h2
          className="text-gray-900 text-lg"
          style={{ fontFamily: 'Poppins', fontWeight: '400' }}
        >
          Campos Obrigatórios (*)
        </h2>
      </div>
      <FormProvider {...methods}>
        <form
          className="flex flex-col gap-4 max-w-6xl mx-auto mt-4"
          onSubmit={handleSubmit(onSubmit)}
          style={{ fontFamily: 'Poppins', fontWeight: '400' }}
        >
          <div className="w-3/4 mx-auto grid grid-cols-2 gap-4">
            {' '}
            <div>
              <label
                htmlFor="nome"
                className="block mb-2 text-sm text-gray-900 text-start"
              >
                NOME DO PERIÓDICO*
              </label>
              <input
                type="text"
                id="nome"
                className="border text-sm rounded-none focus:border-blue-500 block w-full p-2.5 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500"
                placeholder="Digite o nome do periódico..."
                {...register('nome')}
              />
              {errors.nome && (
                <p className="text-red-500 text-sm mt-1 text-left">
                  {errors.nome.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="areasPesquisaIds"
                className="block mb-2 text-sm text-gray-900 text-start"
              >
                ÁREA DE CONHECIMENTO (CNPQ)*
              </label>
              <Controller
                control={control}
                name="areasPesquisaIds"
                defaultValue={[]}
                render={({ field }) => (
                  <MultiSelectDropdown
                    options={areas}
                    value={field.value || []}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.areasPesquisaIds && (
                <p className="text-red-500 text-sm mt-1 text-left">
                  {errors.areasPesquisaIds.message}
                </p>
              )}
            </div>
          </div>
          <div className="w-3/4 mx-auto grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="issn"
                className="block mb-2 text-sm text-gray-900 text-start"
              >
                ISSN
              </label>
              <input
                type="text"
                id="issn"
                className="border text-sm rounded-none focus:border-blue-500 block w-full p-2.5 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500"
                placeholder="Ex: 1234-5678"
                {...register('issn')}
              />
              {errors.issn && (
                <p className="text-red-500 text-sm mt-1 text-left">
                  {errors.issn.message}
                </p>
              )}
            </div>
            <div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <span className="block mb-2 text-sm text-gray-900 text-start">
                    VÍNCULO COM A SBC
                  </span>
                  <div className="flex justify-center w-16">
                    <label className="cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          {...register('vinculoSbcCheckbox', {
                            onChange: e => {
                              if (e.target.checked) {
                                setValue('vinculoSbc', 'vinculo_comum');
                                setIsEnableSBC(true);
                              } else {
                                setValue('vinculoSbc', '');
                                setIsEnableSBC(false);
                              }
                              setValue('linkJcr', '');
                              setValue('linkScopus', '');
                              setValue('percentilJcr', '');
                              setValue('percentilScopus', '');
                              setValue('qualisAntigo', '');
                              setValue('linkGoogleScholar', '');
                              setValue('h5', '');
                              setHasQualisSelected(false);
                              setHasH5OrGoogleScholar(false);
                            },
                          })}
                        />
                        <div className="w-12 h-6 rounded-full border-2 border-gray-300 bg-gray-200 peer-checked:bg-white transition-all duration-300 ease-in-out" />
                        <div className="absolute top-1/2 w-8 h-8 rounded-full bg-gray-400 peer-checked:bg-black transform -translate-y-1/2 translate-x-0 peer-checked:translate-x-6 transition-all duration-300 ease-in-out" />
                      </div>
                    </label>
                  </div>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="qualisAntigo"
                    className="block mb-2 text-sm text-gray-900 text-start"
                  >
                    NOTA NO ANTIGO QUALIS
                  </label>
                  <select
                    id="qualisAntigo"
                    className={`text-gray-900 text-sm rounded-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-500 transition-all duration-300 ${
                      !isEnableSBC || hasH5OrGoogleScholar
                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white border-gray-300'
                    } border`}
                    {...register('qualisAntigo')}
                    defaultValue=""
                    disabled={!isEnableSBC || hasH5OrGoogleScholar}
                  >
                    <option value="" className="text-gray-500">
                      Selecione a nota do QUALIS
                    </option>
                    <option value="" className="text-gray-500">
                      -- Limpar seleção --
                    </option>
                    {qualisOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.qualisAntigo && (
                    <p className="text-red-500 text-sm mt-1 text-left">
                      {errors.qualisAntigo.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>{' '}
          <div className="w-full grid grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="linkJcr"
                className="block mb-2 text-sm text-gray-900 text-start"
              >
                LINK DE REPOSITÓRIO (JCR)
              </label>
              <input
                type="text"
                id="linkJcr"
                className={`border text-sm rounded-none focus:border-blue-500 block w-full p-2.5 placeholder-gray-500 text-gray-900 focus:ring-blue-500 transition-all duration-300 ${
                  isEnableSBC
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-gray-300'
                }`}
                placeholder="Digite uma URL válida..."
                disabled={isEnableSBC}
                {...register('linkJcr')}
              />
              {errors.linkJcr && (
                <p className="text-red-500 text-sm mt-1 text-left">
                  {errors.linkJcr.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="linkScopus"
                className="block mb-2 text-sm text-gray-900 text-start"
              >
                LINK DE REPOSITÓRIO (SCOPUS)
              </label>
              <input
                type="text"
                id="linkScopus"
                className={`border text-sm rounded-none focus:border-blue-500 block w-full p-2.5 placeholder-gray-500 text-gray-900 focus:ring-blue-500 transition-all duration-300 ${
                  isEnableSBC
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-gray-300'
                }`}
                placeholder="Digite uma URL válida..."
                disabled={isEnableSBC}
                {...register('linkScopus')}
              />
              {errors.linkScopus && (
                <p className="text-red-500 text-sm mt-1 text-left">
                  {errors.linkScopus.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="linkGoogleScholar"
                className="block mb-2 text-sm text-gray-900 text-start"
              >
                LINK DE REPOSITÓRIO (GOOGLE SCHOLAR)
              </label>
              <input
                type="text"
                id="linkGoogleScholar"
                className={`border text-sm rounded-none focus:border-blue-500 block w-full p-2.5 placeholder-gray-500 text-gray-900 focus:ring-blue-500 transition-all duration-300 ${
                  !isEnableSBC || hasQualisSelected
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-gray-300'
                }`}
                placeholder="Digite uma URL válida..."
                disabled={!isEnableSBC || hasQualisSelected}
                {...register('linkGoogleScholar')}
              />
              {errors.linkGoogleScholar && (
                <p className="text-red-500 text-sm mt-1 text-left">
                  {errors.linkGoogleScholar.message}
                </p>
              )}
            </div>
          </div>
          <div className="w-full grid grid-cols-3 gap-4">
            {' '}
            <div>
              <label
                htmlFor="percentilJcr"
                className="block mb-2 text-sm text-gray-900 text-start"
              >
                PERCENTIL JCR
              </label>{' '}
              <input
                type="text"
                id="percentilJcr"
                className={`border text-sm rounded-none focus:border-blue-500 block w-full p-2.5 placeholder-gray-500 text-gray-900 focus:ring-blue-500 transition-all duration-300 ${
                  isEnableSBC || !linkJcrValue || linkJcrValue === ''
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-gray-300'
                }`}
                placeholder="Digite o percentil do periódico (0-100)..."
                disabled={isEnableSBC || !linkJcrValue || linkJcrValue === ''}
                {...register('percentilJcr')}
              />
              {errors.percentilJcr && (
                <p className="text-red-500 text-sm mt-1 text-left">
                  {errors.percentilJcr.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="percentilScopus"
                className="block mb-2 text-sm text-gray-900 text-start"
              >
                PERCENTIL SCOPUS
              </label>{' '}
              <input
                type="text"
                id="percentilScopus"
                className={`border text-sm rounded-none focus:border-blue-500 block w-full p-2.5 placeholder-gray-500 text-gray-900 focus:ring-blue-500 transition-all duration-300 ${
                  isEnableSBC || !linkScopusValue || linkScopusValue === ''
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-gray-300'
                }`}
                placeholder="Digite o percentil do periódico (0-100)..."
                disabled={
                  isEnableSBC || !linkScopusValue || linkScopusValue === ''
                }
                {...register('percentilScopus')}
              />
              {errors.percentilScopus && (
                <p className="text-red-500 text-sm mt-1 text-left">
                  {errors.percentilScopus.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="h5"
                className="block mb-2 text-sm text-gray-900 text-start"
              >
                ÍNDICE H5
              </label>
              <input
                type="text"
                id="h5"
                className={`border text-sm rounded-none focus:border-blue-500 block w-full p-2.5 placeholder-gray-500 text-gray-900 focus:ring-blue-500 transition-all duration-300 ${
                  !isEnableSBC ||
                  hasQualisSelected ||
                  !googleScholarValue ||
                  googleScholarValue === ''
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-gray-300'
                }`}
                placeholder="númerico (campo)"
                disabled={
                  !isEnableSBC ||
                  hasQualisSelected ||
                  !googleScholarValue ||
                  googleScholarValue === ''
                }
                {...register('h5')}
              />
              {errors.h5 && (
                <p className="text-red-500 text-sm mt-1 text-left">
                  {errors.h5.message}
                </p>
              )}
            </div>
          </div>
          <div className="w-full flex justify-center mt-6">
            <button
              type="submit"
              className="!px-8 !py-3 !bg-black !text-white !border-0 !rounded-none hover:!bg-gray-800 focus:!outline-none focus:!ring-2 focus:!ring-gray-500 focus:!ring-opacity-50 disabled:!opacity-50"
              style={{ fontFamily: 'Poppins', fontWeight: '400' }}
            >
              Salvar e Continuar
            </button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}

export default function FormularioPeriodico() {
  return <FormularioPeriodicoContent />;
}
