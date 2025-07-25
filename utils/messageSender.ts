import * as SMS from 'expo-sms';
import * as MailComposer from 'expo-mail-composer';
import { Linking } from 'react-native';

export type MessageActionItem = {
  type: 'sms' | 'email' | 'whatsapp';
  target: string;
  message: string;
};

export async function sendMessage(action: MessageActionItem) {
  switch (action.type) {
    case 'sms':
      if (await SMS.isAvailableAsync()) {
        await SMS.sendSMSAsync([action.target], action.message);
      } else {
        console.warn('SMS não disponível');
      }
      break;
    case 'email':
      if (await MailComposer.isAvailableAsync()) {
        await MailComposer.composeAsync({
          recipients: [action.target],
          subject: 'Alerta do PinGo',
          body: action.message,
        });
      } else {
        console.warn('Email não disponível');
      }
      break;
    case 'whatsapp':
      const phone = action.target.replace(/\D/g, '');
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(action.message)}`;
      if (await Linking.canOpenURL(url)) {
        await Linking.openURL(url);
      } else {
        console.warn('WhatsApp não disponível');
      }
      break;
  }
}

export async function sendMultipleMessages(actions: MessageActionItem[]) {
  for (const action of actions) {
    await sendMessage(action);
  }
}
