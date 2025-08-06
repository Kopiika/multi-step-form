const formPages = document.querySelectorAll(".form__page");
const nextBtn = document.querySelector(".next__btn");
const backBtn = document.querySelector(".back__btn");
const confirmBtn = document.querySelector(".confirm__btn");
const totalPriceEl = document.getElementById("totalPrice");

let currentStep = 0;

const formData = {
  name: "",
  email: "",
  phone: "",
  plan: "advanced",
  isYearly: false,
  addons: []
};

const planPrices = {
  arcade: { monthly: 9, yearly: 90 },
  advanced: { monthly: 12, yearly: 120 },
  pro: { monthly: 15, yearly: 150 },
};

const addonPrices = {
  "online-service": { monthly: 1, yearly: 10 },
  "larger-storage": { monthly: 2, yearly: 20 },
  "customizable-profile": { monthly: 2, yearly: 20 },
};

// ==== SWITCHING STEPS ====
function showStep(step) {
  formPages.forEach(page => page.classList.remove("active"));
  formPages[step].classList.add("active");
  updateSidebarStep(step);
};

function updateSidebarStep(step) {
	const steps = document.querySelectorAll('.step');
	steps.forEach(step => step.classList.remove('active'));
	steps[step].classList.add('active');
 }

// Update button visibility "Go Back"
function updateNavigationButtons() {
	const actions = document.querySelector('.form__actions');

	backBtn.style.display = currentStep === 0 ? "none" : "inline-block";
	nextBtn.style.display = currentStep >= 3 ? "none" : "inline-block";
	confirmBtn.style.display = currentStep === 3 ? "inline-block" : "none";

	if (currentStep === 0) {
		actions.classList.add("only-next");
	} else {
		actions.classList.remove("only-next")
	}
 };

 // Initial state
showStep(currentStep);
updateNavigationButtons();

nextBtn.addEventListener("click", () => {
  if (currentStep === 0 && !validateStep1()) return;
  if (currentStep === 1 && !collectStep2Data()) return;
  if (currentStep === 2) {
    collectStep3Data();
    calculateTotal();
    renderSummary();
  }

  if (currentStep < formPages.length - 1) {
    currentStep++;
    showStep(currentStep);
	 updateNavigationButtons();
  }
});

backBtn.addEventListener("click", () => {
  if (currentStep > 0) {
	currentStep--;
   showStep(currentStep);
	updateNavigationButtons();
  }
});

confirmBtn.addEventListener("click", () => {
	document.querySelectorAll(".form__page").forEach(page => {
		page.style.display = "none";
	 });

	 const confirmPage = document.getElementById("step-5");
   confirmPage.style.display = "flex";

	document.querySelector(".form__actions").style.display = "none";
});

// === Clear all errors before validation ===
function clearAllErrors(){
	document.querySelectorAll(".error-message").forEach(el => el.textContent = "");
	document.querySelectorAll(".invalid").forEach(el => el.classList.remove("invalid"));
}

// === Errors are cleared when typing in the input field ===
function addLiveValidationListeners() {
	const fields = [
	  { inputId: "userName", errorId: "userNameError" },
	  { inputId: "userEmail", errorId: "userEmailError" },
	  { inputId: "userPhone", errorId: "userPhoneError" }
	];
 
	fields.forEach(({ inputId, errorId }) => {
	  const input = document.getElementById(inputId);
	  const error = document.getElementById(errorId);
 
	  input.addEventListener("input", () => {
		 error.textContent = "";
		 input.classList.remove("invalid");
	  });
	});
 }
 
 addLiveValidationListeners();

// ==== FORM VALIDATION ====
function validateStep1() {
  clearAllErrors();

  const name = document.getElementById("userName");
  const email = document.getElementById("userEmail");
  const phone = document.getElementById("userPhone");

  const nameError = document.getElementById("userNameError");
  const emailError = document.getElementById("userEmailError");
  const phoneError = document.getElementById("userPhoneError");

  let isValid = true;

  if (name.value.trim() === "") {
	nameError.textContent = "This field is required";
	name.classList.add("invalid");
	isValid = false;
  }

  if (email.value.trim() === "") {
	emailError.textContent = "This field is required";
	email.classList.add("invalid");
	isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
	emailError.textContent = "Enter a valid email";
	email.classList.add("invalid");
	isValid = false;
  }

  if (phone.value.trim() === "") {
	phoneError.textContent = "This field is required";
	phone.classList.add("invalid");
	isValid = false;
  } else if (!/^\+?[0-9\s\-]{7,15}$/.test(phone.value.trim())) {
	phoneError.textContent = "Enter a valid phone number";
	phone.classList.add("invalid");
	isValid =false;
  }

  if (isValid) {
	formData.name = name.value.trim();
	formData.email = email.value.trim();
	formData.phone = phone.value.trim();
 }

  return isValid;
}

// ==== Price change when changing plan duration ====

const durationToggle = document.getElementById("durationToggle");

durationToggle.addEventListener("change", () => {
	updatePlanPrices();
	updateAddonPrices();
	
	if (currentStep === 3) {
   calculateTotal();
   renderSummary();
	}
});

function updatePlanPrices () {
	const isYearly = durationToggle.checked;
	const priceElements = document.querySelectorAll(".plan__price");
	const promoElements = document.querySelectorAll(".plan__promo");

	priceElements.forEach (priceElement => {
		const plan = priceElement.dataset.plan;
		const price = planPrices[plan][isYearly ? "yearly" : "monthly"];
		priceElement.textContent = `$${price}/${isYearly ? "yr" : "mo"}`;
	});

	promoElements.forEach(promoElement => {
		promoElement.textContent = isYearly? "2 months free" : "";
	});

	const monthlyLabel = document.getElementById("monthlyLabel");
	const yearlyLabel = document.getElementById ("yearlyLabel");

	if(isYearly){
		yearlyLabel.classList.add("active");
		monthlyLabel.classList.remove("active");
	} else {
		yearlyLabel.classList.remove("active");
		monthlyLabel.classList.add("active");
	}
}

function updateAddonPrices() {
	const isYearly = durationToggle.checked;
	const addonLabels = document.querySelectorAll(".addon__option");
	
	addonLabels.forEach(label => {
		const input = label.querySelector('input[type="checkbox"]');
		const addon = input.value;
		const priceSpan = label.querySelector('.addon__content span');

		if (addonPrices[addon]) {
			const price = addonPrices[addon][isYearly ? "yearly" : "monthly"];
			const suffix = isYearly ? "yr" : "mo";
			priceSpan.textContent = `+$${price}/${suffix}`;
		}
	});
}

// ==== changing the styles of the checked addons  ====

document.querySelectorAll('.addon__option input[type="checkbox"]').forEach(input => {
	input.addEventListener('change', () => {
	  const label = input.closest('.addon__option');
	  if (input.checked) {
		 label.classList.add('checked');
	  } else {
		 label.classList.remove('checked');
	  }
	});
 });

// ==== DATA COLLECTION ====
function collectStep2Data() {
  const selectedPlan = document.querySelector("input[name='plan']:checked");
  const isYearly = document.querySelector(".switch input[type='checkbox']").checked;

  formData.plan = selectedPlan.value;
  formData.isYearly = isYearly;
  return true;
}

function collectStep3Data() {
  const addonCheckboxes = document.querySelectorAll("input[name='addon']:checked");
  formData.addons = Array.from(addonCheckboxes).map(input => input.value);
}

function calculateTotal() {
	const isYearly = formData.isYearly;
  const planPrice = planPrices[formData.plan][isYearly ? "yearly" : "monthly"];
  const addonsPrice = formData.addons.reduce((sum, addon) => {
    return sum + addonPrices[addon][isYearly ? "yearly" : "monthly"];
  }, 0);

  const total = planPrice + addonsPrice;

  const totalPriceEl = document.getElementById("totalPrice");
  const totalDurationEl = document.getElementById("totalDuration");

  totalDurationEl.textContent = `Total (per ${isYearly ? "year" : "month"})`;
  totalPriceEl.textContent = `$${total}/${formData.isYearly ? "yr" : "mo"}`;
}

// ==== Render summary ====
function renderSummary() {
  const summaryContainer = document.getElementById("summaryDetails");
  summaryContainer.innerHTML = "";

  const plan = formData.plan;
  const isYearly = formData.isYearly;
  const cycle = isYearly ? "Yearly" : "Monthly";
  const cycleKey = isYearly ? "yearly" : "monthly";
  const planCost = planPrices[plan][cycleKey];

  const planEl = document.createElement("div");
  planEl.classList.add("summary__plan");
  planEl.innerHTML = `
    <div class="summary__plan-header">
      <h4>${plan.charAt(0).toUpperCase() + plan.slice(1)} (${cycle})</h4>
      <button type="button" id="changePlan" class="change-link">Change</button>
    </div>
    <div class="summary__plan-price">$${planCost}/${isYearly ? "yr" : "mo"}</div>
  `;

  summaryContainer.appendChild(planEl);

  if (formData.addons.length > 0) {
	const divider = document.createElement("hr");
	divider.classList.add("summary__divider");
	summaryContainer.appendChild(divider);

  const addonsList = document.createElement("div");
  addonsList.classList.add("summary__addons");

  formData.addons.forEach(addon => {
    const addonCost = addonPrices[addon][cycleKey];
    const addonEl = document.createElement("div");
    addonEl.classList.add("summary__addon");
    addonEl.innerHTML = `
      <span>${addon.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</span>
      <span class = "summary__addon-price">+$${addonCost}/${isYearly ? "yr" : "mo"}</span>
    `;
    addonsList.appendChild(addonEl);
  });

  summaryContainer.appendChild(addonsList);
}

  document.getElementById("changePlan").addEventListener("click", () => {
    currentStep = 1;
    showStep(currentStep);
	 updateNavigationButtons(currentStep);
  });
}
