import axios from 'axios';

export class WhatsAppService {
    public static async sendWhatsAppAlert(ticket: any) {
        const token = process.env.WHATSAPP_ACCESS_TOKEN;
        const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
        const adminNumber = process.env.WHATSAPP_ADMIN_NUMBER;

        if (!token || !phoneId || !adminNumber) {
            console.warn('WhatsApp configuration missing or incomplete. Skipping alert.');
            return;
        }

        try {
            const url = `https://graph.facebook.com/v18.0/${phoneId}/messages`;
            const data = {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: adminNumber,
                type: "text",
                text: {
                    body: `🎫 *New Support Ticket*\n\nID: #${ticket.id}\nSubject: ${ticket.subject}\nPriority: ${ticket.priority.toUpperCase()}\nStatus: ${ticket.status.toUpperCase()}\n\nPlease check the admin panel to respond.`
                }
            };

            await axios.post(url, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(`WhatsApp alert sent for ticket #${ticket.id}`);
        } catch (error: any) {
            console.error('Failed to send WhatsApp alert:', error.response?.data || error.message);
        }
    }

    public static async sendOtp(number: string, code: string) {
        const token = process.env.WHATSAPP_ACCESS_TOKEN;
        const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

        if (!token || !phoneId) {
            console.warn('WhatsApp configuration missing or incomplete. Skipping OTP.');
            return;
        }

        try {
            const url = `https://graph.facebook.com/v18.0/${phoneId}/messages`;
            
            // Note: Meta requires an approved template for OTPs. 
            // The template usually has a name like 'auth_otp' or similar.
            const data = {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: number.replace('+', ''),
                type: "template",
                template: {
                    name: "auth_otp", // Change this to your Meta template name
                    language: {
                        code: "en_US"
                    },
                    components: [
                        {
                            type: "body",
                            parameters: [
                                { type: "text", text: code }
                            ]
                        }
                    ]
                }
            };

            await axios.post(url, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(`WhatsApp OTP sent to ${number}`);
        } catch (error: any) {
            console.error('Failed to send WhatsApp OTP:', error.response?.data || error.message);
        }
    }
}
