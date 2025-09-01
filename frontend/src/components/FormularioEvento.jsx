import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { CadastrarEventoSchema } from '../schemas/CadastrarEventoSchema';
import useAreas from '../hooks/useAreas';
import { useNavigate } from 'react-router-dom';
import { MultiSelectDropdown } from './MultipleSelectDropdown';
import { calcularClassificacaoEvento } from '../utils/classificacaoBase';

function FormularioEventoContent() {
  const navigate = useNavigate();

  const methods = useForm({
    resolver: zodResolver(CadastrarEventoSchema),
  });

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    control,
    formState: { errors },
  } = methods;

  const vinculoSbcCheckbox = watch('vinculoSbcCheckbox');

  const sbcOptions = [
    { value: 'vinculo_comum', label: 'Comum' },
    { value: 'vinculo_top_20', label: 'Top 20' },
    { value: 'vinculo_top_10', label: 'Top 10' },
  ];

  const areas = useAreas();

  const onSubmit = data => {
    const vinculoFinal = vinculoSbcCheckbox ? data.vinculoSbc : 'sem_vinculo';
    const h5Value = data.h5 ? Number(data.h5.toString().replace(',', '.')) : 0;
    const eventData = {
      ...data,
      vinculoSbc: vinculoFinal,
      areasPesquisaIds: data.areasPesquisaIds || [],
      classificacao: calcularClassificacaoEvento(h5Value, vinculoFinal),
    };
    console.log('Submitting event data:', eventData);
    navigate('/revisao-cadastro-evento', {
      state: { eventData },
    });
  };

  return (
    <FormProvider {...methods}>
      <form className="max-w-5xl mx-auto" onSubmit={handleSubmit(onSubmit)}>
        <div className="rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">NOME DO EVENTO*</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Digite..."
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
                <span className="label-text font-medium">ÍNDICE H5</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Valor numérico"
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
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">
                  VÍNCULO COM A SBC
                </span>
              </label>
              <div className="flex items-center gap-4 w-full">
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      {...register('vinculoSbcCheckbox', {
                        onChange: e => {
                          if (!e.target.checked) {
                            setValue('vinculoSbc', '');
                          }
                        },
                      })}
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <select
                    id="vinculoSbc"
                    className={`select select-bordered w-full transition-opacity duration-300 ${
                      vinculoSbcCheckbox
                        ? 'opacity-100'
                        : 'opacity-50 pointer-events-none'
                    }`}
                    {...register('vinculoSbc')}
                    defaultValue=""
                    disabled={!vinculoSbcCheckbox}
                  >
                    <option value="" disabled>
                      Selecione tipo de vínculo
                    </option>
                    {sbcOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.vinculoSbc && vinculoSbcCheckbox && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.vinculoSbc.message}
                      </span>
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">
                  LINK DE REPOSITÓRIO (GOOGLE SCHOLAR)
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="URL válida"
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

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">
                  LINK DE REPOSITÓRIO (SOL-SBC)
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="URL válida"
                {...register('linkSolSbc')}
              />
              {errors.linkSolSbc && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.linkSolSbc.message}
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
  );
}

function FormularioEvento() {
  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-center font-medium mb-4">
          Campos Obrigatórios (*)
        </p>
      </div>
      <FormularioEventoContent />
    </div>
  );
}

export default FormularioEvento;
