// PromptPay QR Code Payload Generator (EMVCo Standard)
// Reference: https://www.bot.or.th/Thai/PaymentSystems/StandardPS/Documents/ThaiQRCode_Standard.pdf

const PROMPTPAY_ID = "00";
const PROMPTPAY_METHOD = "01";
const MERCHANT_INFO = "29";
const APP_ID = "0016A000000677010111";
const COUNTRY_CODE = "5802TH";
const CURRENCY_CODE = "5303764";
const CHECKSUM_ID = "6304";

// CRC-16 CCITT calculation
function crc16(str: string): string {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
    }
  }
  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, "0");
}

function formatLength(value: string): string {
  return value.length.toString().padStart(2, "0");
}

function formatTLV(id: string, value: string): string {
  return id + formatLength(value) + value;
}

function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");
  
  // Thai phone numbers: convert 0x to 66x format
  if (digits.startsWith("0")) {
    return "0066" + digits.substring(1);
  }
  
  // If already has country code
  if (digits.startsWith("66")) {
    return "00" + digits;
  }
  
  return digits;
}

export function generatePromptPayPayload(
  phoneNumber: string,
  amount?: number
): string {
  // Format phone number for PromptPay
  const formattedPhone = formatPhoneNumber(phoneNumber);
  
  // Build merchant account information
  const merchantSubfields = 
    formatTLV("00", APP_ID) + 
    formatTLV("01", formattedPhone);
  
  // Build main payload
  let payload = "";
  
  // Payload Format Indicator
  payload += formatTLV("00", "01");
  
  // Point of Initiation Method (11 = static, 12 = dynamic)
  payload += formatTLV("01", amount ? "12" : "11");
  
  // Merchant Account Information (Tag 29 for PromptPay)
  payload += formatTLV("29", merchantSubfields);
  
  // Country Code
  payload += COUNTRY_CODE;
  
  // Transaction Currency (764 = THB)
  payload += CURRENCY_CODE;
  
  // Transaction Amount (optional)
  if (amount && amount > 0) {
    const amountStr = amount.toFixed(2);
    payload += formatTLV("54", amountStr);
  }
  
  // Checksum placeholder
  payload += CHECKSUM_ID;
  
  // Calculate and append CRC
  const checksum = crc16(payload);
  payload += checksum;
  
  return payload;
}

// Default PromptPay phone number for receiving payments
export const PROMPTPAY_PHONE = "061-6080-720";
