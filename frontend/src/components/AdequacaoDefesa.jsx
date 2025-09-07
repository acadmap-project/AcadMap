import React from 'react';
import PropTypes from 'prop-types';

const AdequacaoDefesa = ({ adequacaoDefesa }) => {
  const getAdequacaoStyle = adequacao => {
    const styles = {
      nenhum: 'text-red-600 font-medium',
      mestrado: 'text-yellow-600 font-medium',
      mestrado_doutorado: 'text-green-600 font-medium',
    };
    return styles[adequacao] || styles.nenhum;
  };

  const formatarAdequacao = adequacao => {
    const formatacao = {
      nenhum: 'Nenhum',
      mestrado: 'Apenas Mestrado',
      mestrado_doutorado: 'Mestrado e Doutorado',
    };
    return formatacao[adequacao] || 'Nenhum';
  };

  return (
    <div className="p-4 rounded-lg shadow-sm my-4">
      <h4 className="font-semibold text-lg mb-2">Adequação para Defesa</h4>
      <p className={getAdequacaoStyle(adequacaoDefesa)}>
        {formatarAdequacao(adequacaoDefesa)}
      </p>
    </div>
  );
};

AdequacaoDefesa.propTypes = {
  adequacaoDefesa: PropTypes.oneOf(['nenhum', 'mestrado', 'mestrado_doutorado'])
    .isRequired,
};

export default AdequacaoDefesa;
