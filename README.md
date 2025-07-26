# 📍 PinGo - Geoalarme Inteligente

Aplicativo mobile desenvolvido como projeto da disciplina **Aplicações para Dispositivos Móveis** da **Universidade Federal da Bahia (UFBA)**.

## 🎓 Informações Acadêmicas

- **Aluno**: Jorge Souza Sant’anna  
- **Professora**: Laise Cavalcante  
- **Curso**: Sistemas de Informação  
- **Disciplina**: Aplicações para Dispositivos Móveis  
- **Ano**: 2025

---

## 🧠 Descrição

**PinGo** é um aplicativo de **geoalarme** que envia alertas personalizados ao usuário quando ele entra em uma área geográfica previamente configurada. Ele pode ser usado para diversas finalidades:

- Lembrar de atividades em determinados locais.
- Notificar com envio de SMS, e-mail ou mensagens via WhatsApp.
- Integrar com assistentes como a Alexa (em versões futuras).

---

## 👤 Público-Alvo

- Estudantes
- Profissionais em trânsito
- Pessoas com TDAH ou que precisam de lembretes baseados em localização
- Qualquer usuário que queira automatizar ações ao chegar a certos locais

---

## 🚀 Funcionalidades

- Cadastro de alarmes por nome, localização, raio e dias da semana
- Seleção de frequência: "Uma vez" ou "Repetir sempre"
- Ações ao entrar na área:  
  - Nenhuma  
  - Enviar lembrete (texto)  
  - Enviar mensagens (SMS, e-mail, WhatsApp)
- Mapa interativo com busca de locais via Google Places API
- Visualização e edição de alarmes
- Ativação/desativação de alarmes com switch
- Notificações automáticas ao entrar na área geográfica
- Interface moderna e intuitiva

---

## 🧰 Tecnologias Utilizadas

- **React Native** com Expo
- **TypeScript**
- **React Navigation**
- **React Native Maps**
- **Expo Location**
- **Expo Notifications**
- **Expo SMS**
- **Expo Mail Composer**
- **Google Places API**
- **AsyncStorage** para persistência local

---

## 🛠️ Instalação e Execução do Projeto

### 1. Pré-requisitos

- Node.js
- Expo CLI (`npm install -g expo-cli`)
- Conta Google com chave da **Google Places API**

### 2. Clone o projeto

git clone https://github.com/seu-usuario/pingo-mobile.git
cd pingo-mobile

### 3. Configure e execute

npm install
Crie um arquivo .env na raiz do projeto ou configure diretamente no app.config.js ou app.json:
{
  "expo": {
    "extra": {
      "apiKeyGoogleMaps": "SUA_API_KEY"
    }
  }
}

npx expo start

```bash
