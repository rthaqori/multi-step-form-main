document.addEventListener('DOMContentLoaded', () => {
  const steps = document.querySelectorAll('.form > div');
  const backButton = document.getElementById('back');
  const nextButton = document.getElementById('next');
  const changePlan = document.querySelector("#change-plan");
  let currentStep = 0;

  function updateStep() {
    steps.forEach((step, index) => {
      step.classList.toggle('active', index === currentStep);
    });

    backButton.style.display = currentStep === 0 || currentStep === steps.length - 1 ? 'none' : 'inline-block';
    nextButton.style.display = currentStep === steps.length - 1 ? 'none' : 'inline-block';
  }

  function validateStep() {
    let isValid = true;
    if (currentStep === 0) {
      const name = document.querySelector('input[placeholder="e.g. Stephen King"]');
      const email = document.querySelector('input[placeholder="e.g. stephenking@lorem.com"]');
      const phone = document.querySelector('input[placeholder="e.g. +1 234 567 890"]');
      if (!name.value || !email.value || !phone.value) {
        isValid = false;
      }
    } else if (currentStep === 1) {
      const planItems = document.querySelectorAll('.plan-item');
      isValid = Array.from(planItems).some(planItem => planItem.classList.contains('outline'));
    } else if (currentStep === 2) {
      const addOns = document.querySelectorAll('.add-ons input[type="checkbox"]');
      isValid = Array.from(addOns).some(addOn => addOn.checked);
    }
    return isValid;
  }

  backButton.addEventListener('click', () => {
    if (currentStep > 0) {
      currentStep--;
      updateStep();
    }
  });

  nextButton.addEventListener('click', () => {
    if (validateStep() && currentStep < steps.length - 1) {
      currentStep++;
      updateStep();
    }
  });

  changePlan.addEventListener('click', (event) => {
    event.preventDefault();
    currentStep = 1;
    updateStep();
  });

  // Initial setup
  updateStep();
});


// Monthly - Yearly Switch
const planSwitch = document.querySelector("#plan-switch-checkbox");

planSwitch.addEventListener('change', function () {
  const yearlySpan = document.querySelector('.yearly');
  const monthlySpan = document.querySelector('.monthly');
  const monthlyPrices = document.querySelectorAll('.monthly-price');
  const yearlyPrices = document.querySelectorAll('.yearly-price');
  const monthlyAddOnns = document.querySelectorAll('.addon-price-monthly');
  const yearlyAddOnns = document.querySelectorAll('.addon-price-yearly');


  if (this.checked) {
    yearlySpan.classList.add('blur');
    monthlySpan.classList.remove('blur');

    monthlyPrices.forEach(price => price.style.display = 'none');
    yearlyPrices.forEach(price => price.style.display = 'flex');
    monthlyAddOnns.forEach(price => price.style.display = 'none');
    yearlyAddOnns.forEach(price => price.style.display = 'flex');

  } else {
    yearlySpan.classList.remove('blur');
    monthlySpan.classList.add('blur');

    monthlyPrices.forEach(price => price.style.display = 'block');
    yearlyPrices.forEach(price => price.style.display = 'none');
    monthlyAddOnns.forEach(price => price.style.display = 'flex');
    yearlyAddOnns.forEach(price => price.style.display = 'none');
  }
});

// Plan selection
const plans = document.querySelectorAll(".plan-item");

plans.forEach(plan => {
  plan.addEventListener("click", () => {
    plans.forEach(p => p.classList.remove('outline'));
    plan.classList.add('outline');
    updatePlanPrice();
  });
});

// Add-on checkboxes
const addOnns = document.querySelectorAll(".addon-type input[type='checkbox']");

addOnns.forEach((checkbox, index) => {
  checkbox.addEventListener('change', function () {
    const addOnn = this.closest('.addon-type');
    if (this.checked) {
      addOnn.classList.add('outline');
    } else {
      addOnn.classList.remove('outline');
    }
    updateSummary();
  });
});

const planSelects = document.querySelectorAll('.plan-item .select');
const planPrice = document.querySelector("#plan-price");
const planSwitchCheckbox = document.querySelector('#plan-switch-checkbox');
const packagePlan = document.querySelector('#plan-pachage');
const packageDuration = document.querySelector('#package-duration');

const updatePlanPrice = () => {
  const outlinedPlan = document.querySelector('.plan-item.outline');
  if (outlinedPlan) {
    const isYearly = planSwitchCheckbox.checked;
    const priceElement = isYearly ? outlinedPlan.querySelector('.yearly-price .price') : outlinedPlan.querySelector('.monthly-price');
    const price = priceElement.innerText.match(/(\d+)/)[0];
    planPrice.textContent = `$${price}/${isYearly ? 'yr' : 'mo'}`;
    packagePlan.textContent = outlinedPlan.querySelector('.item-catagory').textContent;
    packageDuration.textContent = isYearly ? 'Yearly' : 'Monthly';
    updateSummary();
  }
};

planSwitchCheckbox.addEventListener('change', () => {
  updatePlanPrice();
});

// Initial update of plan price
updatePlanPrice();

const updateSummary = () => {
  const outlinedPlan = document.querySelector('.plan-item.outline');
  const isYearly = planSwitchCheckbox.checked;
  let planPriceValue = 0;

  if (outlinedPlan) {
    const priceElement = isYearly ? outlinedPlan.querySelector('.yearly-price .price') : outlinedPlan.querySelector('.monthly-price');
    planPriceValue = parseInt(priceElement.innerText.match(/(\d+)/)[0]);
  }

  let totalPrice = planPriceValue;
  const additionalServices = document.querySelector('.additional-services');
  additionalServices.innerHTML = '';

  addOnns.forEach((checkbox, index) => {
    if (checkbox.checked) {
      const service = checkbox.closest('.addon-type');
      const serviceName = service.querySelector('h3').innerText;
      const servicePrice = parseInt(isYearly ? service.querySelector('.addon-price-yearly').innerText.match(/(\d+)/)[0] : service.querySelector('.addon-price-monthly').innerText.match(/(\d+)/)[0]);
      totalPrice += servicePrice;

      const serviceElement = document.createElement('div');
      serviceElement.classList.add('service');
      serviceElement.innerHTML = `<p>${serviceName}</p><p>+$${servicePrice}/${isYearly ? 'yr' : 'mo'}</p>`;
      additionalServices.appendChild(serviceElement);
    }
  });

  const totalElement = document.querySelector('.total p:last-child');
  totalElement.textContent = `+$${totalPrice}/${isYearly ? 'yr' : 'mo'}`;
};

updateSummary();


