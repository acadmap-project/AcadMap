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
  //const vinculoSBC = watch('vinculoSbcCheckbox');
  //const tipoVinculoSBC = watch('vinculoSbc');

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
    <div>
      <div className="mb-6">
        <p className="text-sm text-center font-medium mb-4">
          Campos Obrigatórios (*)
        </p>
      </div>
      <FormProvider {...methods}>
        <form className="max-w-6xl mx-auto" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">
                    NOME DO PERIÓDICO*
                  </span>
                </label>
                <input
                  type="text"
                  id="nome"
                  className="input input-bordered w-full"
                  placeholder="Digite o nome do periódico..."
                  {...register('nome')}
                />
                {errors.nome && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.nome.message}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">
                    ÁREA DE CONHECIMENTO (CNPQ)*
                  </span>
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
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.areasPesquisaIds.message}
                    </span>
                  </label>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">ISSN</span>
                </label>
                <input
                  type="text"
                  id="issn"
                  className="input input-bordered w-full"
                  placeholder="Ex: 1234-5678"
                  {...register('issn')}
                />
                {errors.issn && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.issn.message}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">
                    VÍNCULO COM A SBC
                  </span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
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
                    </label>
                  </div>
                  <div className="flex-1">
                    <select
                      id="qualisAntigo"
                      className={`select select-bordered w-full transition-all duration-300 ${
                        !isEnableSBC || hasH5OrGoogleScholar
                          ? 'bg-base-100 cursor-not-allowed'
                          : 'bg-base'
                      }`}
                      {...register('qualisAntigo')}
                      defaultValue=""
                      disabled={!isEnableSBC || hasH5OrGoogleScholar}
                    >
                      <option value="">Selecione a nota do QUALIS</option>
                      <option value="">-- Limpar seleção --</option>
                      {qualisOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.qualisAntigo && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.qualisAntigo.message}
                        </span>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">
                    LINK DE REPOSITÓRIO (JCR)
                  </span>
                </label>
                <input
                  type="text"
                  id="linkJcr"
                  className={`input input-bordered w-full transition-all duration-300 ${
                    isEnableSBC ? 'bg-base-100 cursor-not-allowed' : 'bg-base'
                  }`}
                  placeholder="Digite uma URL válida..."
                  disabled={isEnableSBC}
                  {...register('linkJcr')}
                />
                {errors.linkJcr && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.linkJcr.message}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">
                    LINK DE REPOSITÓRIO (SCOPUS)
                  </span>
                </label>
                <input
                  type="text"
                  id="linkScopus"
                  className={`input input-bordered w-full transition-all duration-300 ${
                    isEnableSBC ? 'bg-base-100 cursor-not-allowed' : 'bg-base'
                  }`}
                  placeholder="Digite uma URL válida..."
                  disabled={isEnableSBC}
                  {...register('linkScopus')}
                />
                {errors.linkScopus && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.linkScopus.message}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">
                    LINK DE REPOSITÓRIO (GOOGLE SCHOLAR)
                  </span>
                </label>
                <input
                  type="text"
                  id="linkGoogleScholar"
                  className={`input input-bordered w-full transition-all duration-300 ${
                    !isEnableSBC || hasQualisSelected
                      ? 'bg-base-100 cursor-not-allowed'
                      : 'bg-base'
                  }`}
                  placeholder="Digite uma URL válida..."
                  disabled={!isEnableSBC || hasQualisSelected}
                  {...register('linkGoogleScholar')}
                />
                {errors.linkGoogleScholar && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.linkGoogleScholar.message}
                    </span>
                  </label>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">PERCENTIL JCR</span>
                </label>
                <input
                  type="text"
                  id="percentilJcr"
                  className={`input input-bordered w-full transition-all duration-300 ${
                    isEnableSBC || !linkJcrValue || linkJcrValue === ''
                      ? 'bg-base-100 cursor-not-allowed'
                      : 'bg-base'
                  }`}
                  placeholder="Digite o percentil do periódico (0-100)..."
                  disabled={isEnableSBC || !linkJcrValue || linkJcrValue === ''}
                  {...register('percentilJcr')}
                />
                {errors.percentilJcr && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.percentilJcr.message}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">
                    PERCENTIL SCOPUS
                  </span>
                </label>
                <input
                  type="text"
                  id="percentilScopus"
                  className={`input input-bordered w-full transition-all duration-300 ${
                    isEnableSBC || !linkScopusValue || linkScopusValue === ''
                      ? 'bg-base-100 cursor-not-allowed'
                      : 'bg-base'
                  }`}
                  placeholder="Digite o percentil do periódico (0-100)..."
                  disabled={
                    isEnableSBC || !linkScopusValue || linkScopusValue === ''
                  }
                  {...register('percentilScopus')}
                />
                {errors.percentilScopus && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.percentilScopus.message}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">ÍNDICE H5</span>
                </label>
                <input
                  type="text"
                  id="h5"
                  className={`input input-bordered w-full transition-all duration-300 ${
                    !isEnableSBC ||
                    hasQualisSelected ||
                    !googleScholarValue ||
                    googleScholarValue === ''
                      ? 'bg-base-100 cursor-not-allowed'
                      : 'bg-base'
                  }`}
                  placeholder="Valor numérico"
                  disabled={
                    !isEnableSBC ||
                    hasQualisSelected ||
                    !googleScholarValue ||
                    googleScholarValue === ''
                  }
                  {...register('h5')}
                />
                {errors.h5 && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.h5.message}
                    </span>
                  </label>
                )}
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <button type="submit" className="btn btn-primary px-8 min-h-12">
                Salvar e Continuar
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default function FormularioPeriodico() {
  return <FormularioPeriodicoContent />;
}
