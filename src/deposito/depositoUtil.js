import { defineRate, getDailyFromTotalInterest, getDailyInterest, getProceedBaru, getTaxTotalInterest, getTenor, getTotalInterest } from "@/pages/transaction/transactionUtil";

export const calculateMetaDeposito = (transactionType, transaction, isManualInputTotalInterest = false) => {
  const {
    accrualType,
    nominal = 0,
    tax = 10,
    interestRate = 0,
    maturityDate,
    effectiveDate,
    transferFee = 0,
    otherFee = 0,
    totalInterest = 0
  } = transaction;

  if (!accrualType) return [0, 0, 0, 0, 0, 0];

  // Convert string values to numbers for consistent calculations
  const [numNominal, numTax, numInterestRate, numTransferFee, numOtherFee, numTotalInterest] = 
    [nominal, tax, interestRate, transferFee, otherFee, totalInterest].map(Number);

  // Determine actYear based on accrualType
  const accrualYearType = accrualType.split('/')[1].toLowerCase();
  const actYear = accrualYearType !== 'act' ? Number(accrualYearType) : 365;

  // Calculate tenor
  const tenor = (maturityDate && effectiveDate) 
    ? getTenor(maturityDate, effectiveDate) 
    : 0;

  //  Calculate rate
  let dailyInterest = 0, derivedinterestRate = numInterestRate, derivedTotalInterest = numTotalInterest;

  if (isManualInputTotalInterest && tenor > 0) {
    dailyInterest = getDailyFromTotalInterest(derivedTotalInterest, tenor, accrualType, effectiveDate, maturityDate);
    derivedinterestRate = defineRate(dailyInterest, nominal, actYear)
  } else {
    dailyInterest = derivedinterestRate 
      ? getDailyInterest(numNominal, derivedinterestRate / 100, actYear) 
      : 0;
  
    derivedTotalInterest = (dailyInterest && tenor) 
      ? getTotalInterest(dailyInterest, tenor, accrualType, effectiveDate, maturityDate) 
      : 0;
  }

  // Calculate tax on total interest
  const taxTotalInterest = getTaxTotalInterest(derivedTotalInterest, numTax / 100);

  // Calculate the final proceed amount
  const proceed = getProceedBaru(numNominal, derivedTotalInterest, taxTotalInterest, numTransferFee, numOtherFee, transactionType);

  return [dailyInterest, tenor, derivedTotalInterest, proceed, taxTotalInterest, derivedinterestRate];
};
