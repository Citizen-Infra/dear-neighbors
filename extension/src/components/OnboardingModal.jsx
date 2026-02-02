import { useState } from 'preact/hooks';
import {
  countries, citiesForCountry,
  selectedCountryId, selectedCityId,
  setSelectedCountry, setSelectedCity,
} from '../store/neighborhoods';
import { uiLanguage, setUiLanguage, t } from '../lib/i18n';
import '../styles/onboarding-modal.css';
import '../styles/language.css';

export function OnboardingModal({ onComplete }) {
  const [step, setStep] = useState(1);

  const countrySelected = Boolean(selectedCountryId.value);
  const citySelected = Boolean(selectedCityId.value);

  function handleCountryChange(e) {
    setSelectedCountry(e.target.value);
  }

  function handleCityChange(e) {
    setSelectedCity(e.target.value);
    setStep(2);
  }

  function handleFinish() {
    localStorage.setItem('dn_onboarded', 'true');
    onComplete();
  }

  return (
    <div class="onboarding-overlay">
      <div class="onboarding-modal">
        <div class="onboarding-header">
          <h2 class="onboarding-title">{t('onboarding.welcome')}</h2>
          <p class="onboarding-subtitle">{t('onboarding.subtitle')}</p>
        </div>

        <div class="onboarding-progress">
          <span class={`onboarding-dot ${step >= 2 ? 'done' : 'active'}`} />
          <span class="onboarding-line">
            <span class={`onboarding-line-fill ${step >= 2 ? 'filled' : ''}`} />
          </span>
          <span class={`onboarding-dot ${step >= 2 ? 'active' : ''}`} />
        </div>

        <div class="onboarding-body">
          <div class="onboarding-steps">
            {/* Step 1: Location */}
            <section class="onboarding-step">
              <label class="onboarding-label">{t('onboarding.selectCountry')}</label>
              <select
                class="location-select"
                value={selectedCountryId.value || ''}
                onChange={handleCountryChange}
              >
                <option value="">{t('settings.selectCountry')}</option>
                {countries.value.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              {countrySelected && (
                <>
                  <label class="onboarding-label">{t('onboarding.selectCity')}</label>
                  <select
                    class="location-select"
                    value={selectedCityId.value || ''}
                    onChange={handleCityChange}
                  >
                    <option value="">{t('settings.selectCity')}</option>
                    {citiesForCountry.value.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </>
              )}
            </section>

            {/* Step 2: Language */}
            {step >= 2 && citySelected && (
              <section class="onboarding-step">
                <label class="onboarding-label">{t('onboarding.languageStep')}</label>
                <div class="lang-switch">
                  <button
                    class={`lang-switch-option ${uiLanguage.value === 'en' ? 'active' : ''}`}
                    onClick={() => setUiLanguage('en')}
                  >
                    <span class="lang-flag">{'\uD83C\uDDEC\uD83C\uDDE7'}</span>
                    English
                  </button>
                  <button
                    class={`lang-switch-option ${uiLanguage.value === 'sr' ? 'active' : ''}`}
                    onClick={() => setUiLanguage('sr')}
                  >
                    <span class="lang-flag">{'\uD83C\uDDF7\uD83C\uDDF8'}</span>
                    Srpski
                  </button>
                </div>
              </section>
            )}
          </div>

          {step >= 2 && citySelected && (
            <button class="onboarding-cta" onClick={handleFinish}>
              {t('onboarding.getStarted')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
