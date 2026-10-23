
/* Kashenyi Secondary School — EmailJS Service
   Compatible with the existing site.min.js interface.
   Load the EmailJS SDK before this file and site.min.js after it.
*/

(() => {
  "use strict";

  const CONFIG = Object.freeze({
    publicKey: "ax52O7pWwvlBz4Dtr",

    serviceId: "service_0l39yci",

    templates: Object.freeze({
      contact: "template_q4n1k34",
      apply: "template_ez1mzgj"
    })
  });

  let initialized = false;

  function initialize() {
    const sdk = window.emailjs;

    if (
      !sdk ||
      typeof sdk.init !== "function" ||
      typeof sdk.send !== "function"
    ) {
      throw new Error(
        "EmailJS SDK is missing. Make sure the EmailJS browser SDK loads before email-service.js."
      );
    }

    if (!initialized) {
      sdk.init({
        publicKey: CONFIG.publicKey
      });

      initialized = true;
    }

    return sdk;
  }

  function normalizeParams(input) {
    if (
      !input ||
      typeof input !== "object" ||
      Array.isArray(input)
    ) {
      throw new Error("The form data is missing or invalid.");
    }

    const params = {};

    Object.entries(input).forEach(([key, value]) => {
      // Never send the honeypot field to the email template.
      if (key === "website") {
        return;
      }

      params[key] = value == null
        ? ""
        : String(value).trim();
    });

    return params;
  }

  window.KSS_EMAIL_SERVICE = Object.freeze({
    isConfigured(type) {
      return Object.prototype.hasOwnProperty.call(
        CONFIG.templates,
        type
      );
    },

    initialize() {
      try {
        initialize();
        return true;
      } catch (error) {
        console.error(
          "EmailJS initialization failed:",
          error
        );

        return false;
      }
    },

    async send(type, formData) {
      const templateId = CONFIG.templates[type];

      if (!templateId) {
        throw new Error(
          `No EmailJS template is configured for form type: ${type}`
        );
      }

      // Ignore bot submissions that fill the hidden honeypot.
      if (
        formData &&
        String(formData.website || "").trim() !== ""
      ) {
        return {
          status: 200,
          skipped: true
        };
      }

      const sdk = initialize();
      const params = normalizeParams(formData);

      try {
        const response = await sdk.send(
          CONFIG.serviceId,
          templateId,
          params
        );

        if (!response || response.status !== 200) {
          throw new Error(
            "EmailJS did not confirm the message."
          );
        }

        return response;
      } catch (error) {
        console.error(
          `EmailJS ${type} submission failed:`,
          error
        );

        throw error;
      }
    }
  });
})();
