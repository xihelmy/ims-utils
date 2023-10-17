import { v4 as uuidv4 } from 'uuid';
import { differenceInMonths, getYear, getMonth, getDate } from 'date-fns';

// --- TRANSACTION CODE GENERATORS ---
export const generateTransactionCode = () => uuidv4();

export const generateTransactionNo = () => 
  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// --- DATE UTILITIES ---
export const getTenor = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const difference = end.getTime() - start.getTime();
  return Math.ceil(difference / (1000 * 60 * 60 * 24));
};

// --- RATE CALCULATIONS ---
export const getDailyInterest = (nominal, interest, accrualTypeYear) => 
  (nominal * interest) / accrualTypeYear;

export const getTotalInterest = (
  dailyInterest,
  tenor,
  accrual,
  effective,
  mature,
) => {
  let accDay = accrual.split('/')[0];

  if (accDay === 'ACT') {
    return dailyInterest * tenor;
  } else {
    const accTypeNumber = Number(accDay);

    if (getDate(effective) === getDate(mature)) {
      if (getYear(effective) === getYear(mature)) {
        let diffMonth = differenceInMonths(mature, effective);
        return dailyInterest * (accTypeNumber * diffMonth);
      } else {
        let diffYearMonths = (getYear(mature) - getYear(effective)) * 12;
        let diffMonth =
          diffYearMonths + (getMonth(mature) - getMonth(effective));
        return dailyInterest * (accTypeNumber * diffMonth);
      }
    } else {
      if (
        (tenor >= 29 && differenceInMonths(mature, effective) !== 0) ||
        (tenor >= 29 && getYear(mature) !== getYear(effective))
      ) {
        if (getYear(effective) === getYear(mature)) {
          let diffMonth = differenceInMonths(mature, effective);
          return dailyInterest * (accTypeNumber * diffMonth);
        } else {
          let diffYearMonths = (getYear(mature) - getYear(effective)) * 12;
          let diffMonth =
            diffYearMonths + (getMonth(mature) - getMonth(effective));
          return dailyInterest * (accTypeNumber * diffMonth);
        }
      } else {
        return dailyInterest * tenor;
      }
    }
  }
};

export const getDailyFromTotalInterest = (
  totalInterest,
  tenor,
  accrual,
  effective,
  mature,
) => {
  let accDay = accrual.split('/')[0];
  if (accDay === 'ACT') {
    return totalInterest / tenor;
  } else {
    const accTypeNumber = Number(accDay);

    if (getDate(effective) === getDate(mature)) {
      if (getYear(effective) === getYear(mature)) {
        let diffMonth = differenceInMonths(mature, effective);
        return totalInterest / (accTypeNumber * diffMonth);
      } else {
        let diffYearMonths = (getYear(mature) - getYear(effective)) * 12;
        let diffMonth =
          diffYearMonths + (getMonth(mature) - getMonth(effective));
        return totalInterest / (accTypeNumber * diffMonth);
      }
    } else {
      if (
        (tenor >= 29 && differenceInMonths(mature, effective) !== 0) ||
        (tenor >= 29 && getYear(mature) !== getYear(effective))
      ) {
        if (getYear(effective) === getYear(mature)) {
          let diffMonth = differenceInMonths(mature, effective);
          return totalInterest / (accTypeNumber * diffMonth);
        } else {
          let diffYearMonths = (getYear(mature) - getYear(effective)) * 12;
          let diffMonth =
            diffYearMonths + (getMonth(mature) - getMonth(effective));
          return totalInterest / (accTypeNumber * diffMonth);
        }
      } else {
        return totalInterest / tenor;
      }
    }
  }
};

export const defineRate = (dailyInterest, nominal, actYear) => dailyInterest * actYear / nominal * 100;

// --- TAX RELATED CALCULATIONS ---
export const getTaxTotalInterest = (totalInterest, tax) => totalInterest * tax;

export const getTaxTotalInterestObligasi = (totalInterest, tax) => totalInterest * (tax / 100);

// --- PROCEED CALCULATIONS ---
export const getProceed = (nominal, totalInterest, taxTotalInterest) => nominal;

export const getProceedBaru = (nominal = 0, totalInterest = 0, taxTotalInterest = 0, biayaTransfer = 0, biayaLainnya = 0, transactionTypeName) => {
  switch (transactionTypeName) {
    case "Sell":
      return nominal + totalInterest - taxTotalInterest - biayaTransfer - biayaLainnya;
    case "AI":
      return totalInterest - taxTotalInterest - biayaLainnya - biayaTransfer;
    default:
      return nominal + biayaLainnya + biayaTransfer + taxTotalInterest;
  }
};

// --- ACRRUE CALCULATIONS ---
export const getAccrualDays = (startDate, endDate, accrual) => {
  const days = getTenor(startDate, endDate);
  let accDay = accrual.split('/')[0];
  if (accDay < 0) accDay *= -1;

  if (accDay === 'ACT') {
    return days;
  } else {
    // Add more logic from the Java method if necessary
    return 0; // Placeholder
  }
};

export const getDailyAccruedInterest = (
  nominal,
  interestRate,
  accrualTypeYear,
) => {
  return (nominal * interestRate) / accrualTypeYear;
};

export const getTotalAccruedInterest = (dailyAccruedInterest, tenor) => {
  return dailyAccruedInterest * tenor;
};

export const getTaxAccruedInterest = (totalAccruedInterest, taxRate) => {
  return totalAccruedInterest * taxRate;
};

// --- BROKER FEE CALCULATIONS ---
export const getAmountBrokerFee = (nominal, brokerFeePercentage) => {
  return nominal * (brokerFeePercentage / 100);
};

export const getTaxTotalBrokerFee = (amountBrokerFee, taxRate) => {
  return amountBrokerFee * taxRate;
};

// --- OTHERS CALCULATIONS ---
export const getGrandTotal = (
  nominal,
  totalAccruedInterest,
  taxAccruedInterest,
  amountBrokerFee,
  taxTotalBrokerFee,
) => {
  return (
    nominal +
    totalAccruedInterest -
    taxAccruedInterest -
    amountBrokerFee -
    taxTotalBrokerFee
  );
};

export const getFeeAmountRvp = (nominal, rvpFeePercentage) => {
  return nominal * (rvpFeePercentage / 100);
};

export const getFeeAmountDvp = (nominal, dvpFeePercentage) => {
  return nominal * (dvpFeePercentage / 100);
};

export const getTotalValue = (unitPrice, totalUnits) => {
  return unitPrice * totalUnits;
};

export const getTotalUnitDvp = (totalValue, dvpFeeAmount) => {
  return totalValue / dvpFeeAmount;
};

export const getTotalUnitRvp = (totalValue, rvpFeeAmount) => {
  return totalValue / rvpFeeAmount;
};

export const getTotalAmount = (principal, accruedInterest) => {
  return principal + accruedInterest;
};

export const getTransactionUnit = (totalAmount, unitPrice) => {
  return totalAmount / unitPrice;
};

export const getDayInYearsACT = (startDate, endDate) => {
  return (endDate - startDate) / (1000 * 60 * 60 * 24);
};

export const setTaxOnCapitalGain = (capitalGain, taxRate) => {
  return capitalGain * taxRate;
};
