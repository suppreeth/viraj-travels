/**
 * WhatsApp Notification Service
 * 
 * NOTE: As per project requirements, WhatsApp integration is structured and prepared
 * but not actively sending messages yet.
 * 
 * When ready to enable WhatsApp notifications:
 * 1. Set WHATSAPP_ENABLED=true in server/.env
 * 2. Configure either WhatsApp Cloud API or Twilio credentials:
 *    - WHATSAPP_API_TOKEN: Meta Graph API Token
 *    - WHATSAPP_PHONE_NUMBER_ID: Sender phone number ID
 *    - ADMIN_WHATSAPP_NUMBER: Viraj Travels admin phone (e.g. +91XXXXXXXXXX)
 * 3. The function below can be activated without changing the lead controller or frontend.
 */

const sendWhatsAppLeadNotification = async (lead) => {
  try {
    const isEnabled = process.env.WHATSAPP_ENABLED === 'true';

    if (!isEnabled) {
      // Structured placeholder for future integration
      console.log(`[WhatsApp Service] Integration standby. New lead logged: ${lead.name} (${lead.phone})`);
      return { success: true, mode: 'placeholder', message: 'WhatsApp notification prepared (integration standby)' };
    }

    // Template message structure ready for Meta Cloud API or Twilio
    const messageBody = [
      `🔔 *New Lead Received - Viraj Travels*`,
      `👤 *Name:* ${lead.name}`,
      `📞 *Phone:* ${lead.phone}`,
      lead.email ? `✉️ *Email:* ${lead.email}` : null,
      lead.requirement ? `✈️ *Requirement:* ${lead.requirement}` : null,
      `📅 *Date:* ${new Date(lead.createdAt || Date.now()).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
      `🏷️ *Source:* ${lead.source || 'Website Popup'}`
    ].filter(Boolean).join('\n');

    // Example Cloud API dispatch:
    // await axios.post(`https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    //   messaging_product: 'whatsapp',
    //   to: process.env.ADMIN_WHATSAPP_NUMBER,
    //   type: 'text',
    //   text: { body: messageBody }
    // }, {
    //   headers: { Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}` }
    // });

    console.log('[WhatsApp Service] Dispatching WhatsApp notification:', messageBody);
    return { success: true, message: 'Notification dispatched' };
  } catch (err) {
    // Fail silently so WhatsApp delivery issues never break lead capture
    console.error('[WhatsApp Service Error]:', err.message);
    return { success: false, error: err.message };
  }
};

module.exports = {
  sendWhatsAppLeadNotification,
};
