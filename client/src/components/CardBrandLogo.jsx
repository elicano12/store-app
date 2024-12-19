import React from 'react';
import visaLogo from '../assets/logos/visa.png';
import mastercardLogo from '../assets/logos/mastercard.png';
// import amexLogo from '../assets/logos/amex.png';
// import discoverLogo from '../assets/logos/discover.png';
// import jcbLogo from '../assets/logos/jcb.png';
import unknownLogo from '../assets/logos/unknown.png';

const getCardBrand = (cardNumber) => {
  if (!cardNumber) return null;

  const cleanedNumber = cardNumber.replace(/\s+/g, ''); // Elimina espacios
  const firstTwoDigits = parseInt(cleanedNumber.slice(0, 2), 10);
  const firstFourDigits = parseInt(cleanedNumber.slice(0, 4), 10);
  const firstDigit = parseInt(cleanedNumber[0], 10);

  if (firstDigit === 4) return 'Visa';
  if (firstTwoDigits >= 51 && firstTwoDigits <= 55) return 'MasterCard';
  if (firstFourDigits >= 2221 && firstFourDigits <= 2720) return 'MasterCard';
  if (firstTwoDigits === 34 || firstTwoDigits === 37) return 'American Express';
  if (firstFourDigits === 6011 || firstTwoDigits === 65) return 'Discover';
  if (firstTwoDigits === 35) return 'JCB';

  return 'Unknown';
};

const CardBrandLogo = ({ cardNumber }) => {
  const brand = getCardBrand(cardNumber);

  const brandLogos = {
    Visa: visaLogo,
    MasterCard: mastercardLogo,
    // 'American Express': amexLogo,
    // Discover: discoverLogo,
    // JCB: jcbLogo,
    Unknown: unknownLogo,
  };

  const logo = brandLogos[brand] || brandLogos.Unknown;

  return <img src={logo} alt={brand} className="w-12 h-8" />;
};

export default CardBrandLogo;
