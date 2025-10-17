const calculateTax = (incomeObj: object, type: string = 'OLD'): object => {
    if (type === 'NEW') {
        return calculateNewTax(incomeObj);
    }
    return calculateOldTax(incomeObj);
};

const calculateNewTax = (incomeObj: object): object => {
    // Implement the logic for new tax calculation
    const { totalIncomeIncludingBonus, incentiveBonus, basicSalary, employerNpsPercent, employerPfPercent } = incomeObj as { totalIncomeIncludingBonus: number; incentiveBonus: number; basicSalary: number; employerNpsPercent: number; employerPfPercent: number };
    const hraExempt = calculateHRA(incomeObj);
    const totalDeductions = calculateTotalDeductions(incomeObj, hraExempt.hraExempt);
    const netTaxableIncome = totalIncomeIncludingBonus - totalDeductions - hraExempt.hraExempt;
    return {
        netTaxableIncome,
        hraExempt: hraExempt.hraExempt,
        totalDeductions,
        incentiveBonus,
        basicSalary,
        employerNpsPercent,
        employerPfPercent
    };
};

const calculateOldTax = (incomeObj: object): object => {
    // Implement the logic for old tax calculation
    return {};
};

const calculateTotalDeductions = (incomeObj: object, hraExempt: number): number => {
    // Implement the logic for total deductions calculation
    const { employerNpsPercent, employerPfPercent, basicSalary } = incomeObj as { employerNpsPercent: number; employerPfPercent: number; basicSalary: number };
    const employerNpsTotal = (employerNpsPercent / 100) * basicSalary;
    const employerPfTotal = (employerPfPercent / 100) * basicSalary;
    return employerNpsTotal + employerPfTotal + hraExempt;
}

const calculateHRA = (incomeObj: object): { hraExempt: number } => {
    // Implement the logic for HRA calculation
    const { basicSalary, hraReceived, rentPaid, isMetro } = incomeObj as { basicSalary: number; hraReceived: number; rentPaid: number, isMetro: boolean };
    const exemptedBasicSalary = isMetro ? 0.5 * basicSalary : 0.4 * basicSalary;
    const surplusRentPaid = rentPaid - (0.1 * basicSalary);
    const hraExempt = Math.min(hraReceived, surplusRentPaid, exemptedBasicSalary);
    return { hraExempt };
}

const calculateFinalTaxableIncome = (totalIncomeIncludingBonus: number, deductions: number): { netTaxable: number } => {
    // Implement the logic for final taxable income calculation
    const netTaxable = totalIncomeIncludingBonus - deductions;
    return { netTaxable };
}

