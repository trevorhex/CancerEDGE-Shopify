const eligibleStates = window.eligibleStates;

const resultEl = document.getElementById("eligibility-result");
const checkoutButtons = document.querySelectorAll(".cart__checkout-button");
const agreementCheckboxes = document.querySelectorAll(".cart__agreement .cart__agreement-checkbox");
window.checkZipCode = false;
let isChecked = false;

// Utility to reset and apply classes
function setResult(message, isSuccess) {
  resultEl.textContent = message;
  resultEl.classList.remove("eligibility-success", "eligibility-error");
  resultEl.classList.add(isSuccess ? "eligibility-success" : "eligibility-error");
  if(isSuccess){
    window.checkZipCode = true;
  }else{
    window.checkZipCode = false;
  }
  agreementCheckboxes.forEach(checkbox => isChecked = checkbox.checked)
  if(isChecked && window.checkZipCode){
    checkoutButtons.forEach(button => button.disabled = false);
  } else {
    checkoutButtons.forEach(button => button.disabled = true);
  }
}

document.getElementById("check-eligibility").addEventListener("click", async function(e) {
  const zip = document.getElementById("zip-input").value.trim();

  if (!/^\d{5}$/.test(zip)) {
    setResult("❌ Please enter a valid 5-digit ZIP code.", false);
    return;
  }

  e.target.disabled = true;

  await fetch(`https://api.zippopotam.us/us/${zip}`)
    .then(response => {
      console.log(response)
      if (!response.ok) throw new Error("Invalid ZIP code");
      return response.json();
    })
    .then(data => {
      const stateAbbr = data.places[0]["state abbreviation"];
      if (eligibleStates.includes(stateAbbr)) {
        setResult(`✅ Eligible - We serve ${stateAbbr}`, true);
      } else {
        setResult(`❌ Not eligible - Membership not available in ${stateAbbr}`, false);
      }
    })
    .catch(() => {
      setResult("❌ Could not find this ZIP code.", false);
    }).finally(() => {
      e.target.disabled = false;
    });
});