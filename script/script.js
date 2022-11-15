const formatCurrency = n => {
	const currency = new Intl.NumberFormat('ru-Ru', {
		style: 'currency',
		currency: 'RUB',
		maximumFractionDigits: 2,
	});

	return currency.format(n);
};

const debounceTimer = (fn, delay) => {
	let lastCall = 0;
	let lastCallTimer = NaN;

	return (...arg) => {
		const previousCall = lastCall;
		lastCall = Date.now();

		if (previousCall && lastCall - previousCall <= delay) {
			clearTimeout(lastCallTimer);
		}

		lastCallTimer = setTimeout(() => {
			fn(...arg);
		}, delay);
	};
};

{
	// навигация
	const navigationLinks = document.querySelectorAll('.navigation__link');

	const calcElems = document.querySelectorAll('.calc');

	navigationLinks.forEach(elemClick => {
		elemClick.addEventListener('click', e => {
			e.preventDefault();

			navigationLinks.forEach(elem => {
				if (elemClick === elem) {
					elem.classList.add('navigation__link_active');
				} else {
					elem.classList.remove('navigation__link_active');
				}
			});

			calcElems.forEach(calcElem => {
				if (elemClick.dataset.tax === calcElem.dataset.tax) {
					calcElem.classList.add('calc_active');
				} else {
					calcElem.classList.remove('calc_active');
				}
			});
		});
	});

	// for (let i = 0; i < navigationLinks.length; i++) {
	// 	navigationLinks[i].addEventListener('click', e => {
	// 		e.preventDefault();
	// 		for (let j = 0; j < calcElems.length; j++) {
	// 			if (navigationLinks[i].dataset.tax === calcElems[j].dataset.tax) {
	// 				calcElems[j].classList.add('calc_active');
	// 				navigationLinks[j].classList.add('navigation__link_active');
	// 			} else {
	// 				calcElems[j].classList.remove('calc_active');
	// 				navigationLinks[j].classList.remove('navigation__link_active');
	// 			}
	// 		}
	// 	});
	// }
}

{
	// ausn

	const ausn = document.querySelector('.ausn');
	const formAusn = ausn.querySelector('.calc__form');
	const resultTaxProfit = ausn.querySelector('.result__tax_profit');
	const resultTaxTotal = ausn.querySelector('.result__tax_total');
	const calcLabelExpenses = ausn.querySelector('.calc__label_expenses');
	const resultBlockProfit = ausn.querySelector('.result__block_profit');

	calcLabelExpenses.style.display = 'none';
	resultBlockProfit.style.display = 'none';

	formAusn.addEventListener(
		'input',
		debounceTimer(e => {
			const income = +formAusn.income.value;
			if (formAusn.type.value === 'income') {
				calcLabelExpenses.style.display = 'none';
				resultBlockProfit.style.display = 'none';
				resultTaxTotal.textContent = formatCurrency(income * 0.08);
				formAusn.expenses.value = '';
			}

			if (formAusn.type.value === 'expenses') {
				const expenses = +formAusn.expenses.value;
				const profit = income < expenses ? 0 : income - expenses;

				resultTaxProfit.textContent = profit;

				calcLabelExpenses.style.display = '';
				resultBlockProfit.style.display = '';
				resultTaxTotal.textContent = formatCurrency(profit * 0.2);
			}
		}, 500),
	);
}

{
	// самозанятый
	const selfEmployment = document.querySelector('.self-employment');
	const formSelfEmployment = selfEmployment.querySelector('.calc__form');
	const resultTaxSelfEmployment = selfEmployment.querySelector('.result__tax');
	const calcCompensation = selfEmployment.querySelector('.calc__label_compensation');
	const resultBlockCompensation = selfEmployment.querySelectorAll('.result__block_compensation');
	const resultTaxCompensation = document.querySelector('.result__tax_compensation');
	const resultTaxRestCompensation = document.querySelector('.result__tax_rest-compensation');
	const resultTaxResult = document.querySelector('.result__tax_result');

	const checkCompensation = () => {
		const setDisplay = formSelfEmployment.addCompensation.checked ? 'block' : 'none';
		calcCompensation.style.display = setDisplay;

		resultBlockCompensation.forEach(elem => {
			elem.style.display = setDisplay;
		});
	};

	checkCompensation();

	formSelfEmployment.addEventListener(
		'input',
		debounceTimer(e => {
			const individual = +formSelfEmployment.individual.value;
			const entity = +formSelfEmployment.entity.value;
			const resultIndividual = individual * 0.04;
			const resultEntity = entity * 0.06;

			checkCompensation();

			const tax = resultIndividual + resultEntity;

			formSelfEmployment.compensation.value =
				+formSelfEmployment.compensation.value > 10000
					? 10000
					: formSelfEmployment.compensation.value;

			const benefit = formSelfEmployment.compensation.value;
			const resBenefit = individual * 0.01 + entity * 0.2;
			const finalBenefit = benefit - resBenefit > 0 ? benefit - resBenefit : 0;

			const finalTax = tax - (benefit - finalBenefit);

			resultTaxSelfEmployment.textContent = formatCurrency(tax);
			resultTaxCompensation.textContent = formatCurrency(benefit - finalBenefit);
			resultTaxRestCompensation.textContent = formatCurrency(finalBenefit);
			resultTaxResult.textContent = formatCurrency(finalTax);
		}, 500),
	);
}

{
	// ОСНО

	const osno = document.querySelector('.osno');
	const formOsno = osno.querySelector('.calc__form');

	const ndflExpenses = osno.querySelector('.result__block_ndfl-expenses');
	const ndflIncome = osno.querySelector('.result__block_ndfl-income');
	const profit = osno.querySelector('.result__block_profit');

	const resultTaxNds = osno.querySelector('.result__tax_nds');
	const resultTaxProperty = osno.querySelector('.result__tax_property');
	const resultTaxNdflExpenses = osno.querySelector('.result__tax_ndfl-expenses');
	const resultTaxNdflIncome = osno.querySelector('.result__tax_ndfl-income');
	const resultTaxNdflProfit = osno.querySelector('.result__tax_profit');

	const checkFormBusiness = () => {
		if (formOsno.formBusiness.value === 'ИП') {
			ndflExpenses.style.display = '';
			ndflIncome.style.display = '';
			profit.style.display = 'none';
		}

		if (formOsno.formBusiness.value === 'ООО') {
			ndflExpenses.style.display = 'none';
			ndflIncome.style.display = 'none';
			profit.style.display = '';
		}
	};

	checkFormBusiness();

	formOsno.addEventListener(
		'input',
		debounceTimer(() => {
			checkFormBusiness();

			const income = +formOsno.income.value;
			const expenses = +formOsno.expenses.value;
			const property = +formOsno.property.value;

			const nds = income * 0.2;
			const taxProperty = property * 0.02;
			const profit = income < expenses ? 0 : income - expenses;
			const ndflExpensesTotal = profit * 0.13;
			const ndflIncomeTotal = (income - nds) * 0.13;
			const taxProfit = profit * 0.2;

			resultTaxNds.textContent = formatCurrency(nds);
			resultTaxProperty.textContent = formatCurrency(taxProperty);
			resultTaxNdflExpenses.textContent = formatCurrency(ndflExpensesTotal);
			resultTaxNdflIncome.textContent = formatCurrency(ndflIncomeTotal);
			resultTaxProfit.textContent = formatCurrency(taxProfit);
		}, 500),
	);
}

{
	// УСН

	const LIMIT = 300000;

	const usn = document.querySelector('.usn');
	const formUsn = usn.querySelector('.calc__form');

	const calcLabelExpensesU = usn.querySelector('.calc__label_expenses');
	const calcLabelPropertyU = usn.querySelector('.calc__label_property');
	const resultBlockPropertyU = usn.querySelector('.result__block_property');

	const resultTaxTotalU = usn.querySelector('.result__tax_total');
	const resultTaxPropertyU = usn.querySelector('.result__tax_property');

	const typeTax = {
		income: () => {
			calcLabelExpensesU.style.display = 'none';
			calcLabelPropertyU.style.display = 'none';
			resultBlockPropertyU.style.display = 'none';

			formUsn.expenses.value = '';
			formUsn.property.value = '';
		},
		'ip-expenses': () => {
			calcLabelExpensesU.style.display = '';
			calcLabelPropertyU.style.display = 'none';
			resultBlockPropertyU.style.display = 'none';

			formUsn.expenses.value = '';
		},
		'ooo-expenses': () => {
			calcLabelExpensesU.style.display = '';
			calcLabelPropertyU.style.display = '';
			resultBlockPropertyU.style.display = '';
		},
	};

	const percent = {
		income: 0.06,
		'ip-expenses': 0.15,
		'ooo-expenses': 0.15,
	};

	typeTax[formUsn.typeTax.value]();

	formUsn.addEventListener(
		'input',
		debounceTimer(() => {
			typeTax[formUsn.typeTax.value]();

			const income = +formUsn.income.value;
			const expenses = +formUsn.expenses.value;
			const contributions = +formUsn.contributions.value;
			const property = +formUsn.property.value;

			let profit = income - contributions;

			if (formUsn.typeTax.value !== 'income') {
				profit -= expenses;
			}

			const taxBigIncome = income > LIMIT ? (profit - LIMIT) * 0.01 : 0;
			const summ = profit - (taxBigIncome < 0 ? 0 : taxBigIncome);
			const tax = summ * percent[formUsn.typeTax.value];
			const taxProperty = property * 0.02;

			resultTaxTotalU.textContent = formatCurrency(tax < 0 ? 0 : tax);
			resultBlockPropertyU.textContent = formatCurrency(taxProperty);
		}, 500),
	);
}

{
	// 13%

	const taxReturn = document.querySelector('.tax-return');
	const formTaxReturn = taxReturn.querySelector('.calc__form');
	const resultTaxNdfl = taxReturn.querySelector('.result__tax_ndfl');
	const resultTaxPossible = taxReturn.querySelector('.result__tax_possible');
	const resultTaxDeduction = taxReturn.querySelector('.result__tax_deduction');

	formTaxReturn.addEventListener(
		'input',
		debounceTimer(() => {
			const expenses = +formTaxReturn.expenses.value;
			const income = +formTaxReturn.income.value;
			const sumExpenses = +formTaxReturn.sumExpenses.value;

			const ndfl = income * 0.13;
			const possibleDeduction = expenses < sumExpenses ? expenses * 0.13 : sumExpenses * 0.13;

			const deduction = possibleDeduction < ndfl ? possibleDeduction : ndfl;

			resultTaxNdfl.textContent = formatCurrency(ndfl);
			resultTaxPossible.textContent = formatCurrency(possibleDeduction);
			resultTaxDeduction.textContent = formatCurrency(deduction);
		}, 500),
	);
}
