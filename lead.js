/* ============================================================
   lead.js — Perceptivity lead capture
   ------------------------------------------------------------
   Sends every captured lead to aniket@tryperceptivity.com.

   Uses FormSubmit (https://formsubmit.co) — a no-backend form
   relay. No API key or account is needed. The FIRST time a lead
   is submitted, FormSubmit emails aniket@tryperceptivity.com a
   one-time activation link; click it once and every subsequent
   lead is delivered automatically.

   Usage:
     PerceptivityLead.send({ name, email, company, ... },
                           { subject: 'New demo request' });
   ============================================================ */
(function () {
  var LEAD_INBOX = 'aniket@tryperceptivity.com';
  var ENDPOINT   = 'https://formsubmit.co/ajax/' + LEAD_INBOX;

  function send(fields, opts) {
    opts = opts || {};
    var payload = {
      _subject:  opts.subject || 'New Perceptivity lead',
      _template: 'table',     // nicely formatted table email
      _captcha:  'false'      // we validate client-side already
    };
    // merge lead fields, skipping empties
    Object.keys(fields || {}).forEach(function (k) {
      var v = fields[k];
      if (v === undefined || v === null) return;
      if (Array.isArray(v)) v = v.join(', ');
      v = String(v).trim();
      if (v) payload[k] = v;
    });
    // stamp source + time so leads are traceable
    if (!payload.Source) payload.Source = (location && location.pathname || '').replace(/^.*\//, '') || 'site';
    payload.Submitted = new Date().toLocaleString();

    if (typeof fetch !== 'function') return Promise.resolve();
    return fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (r) { return r.json().catch(function () { return {}; }); })
      .then(function (res) { console.info('[lead] sent →', LEAD_INBOX, res && res.message ? '(' + res.message + ')' : ''); return res; })
      .catch(function (err) { console.warn('[lead] send failed', err); });
  }

  window.PerceptivityLead = { send: send, inbox: LEAD_INBOX };
})();
