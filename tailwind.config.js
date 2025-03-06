/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        Primary: '#FF7B00',
        Secondary: '#1F90FF',
        Green: '#42C90D',
        LightBlue: '#EBF5FF',
        LightOrange: '#FFF2ED',
        BorderColor: '#B3B3B3',
        Black: '#15121C',
        BlockBlack: '#1A1A1A',
        LightBlack: '#565656',
        LightText: '#5E5E5E',
        ThemeYellow: '#F8D654',
        GrayText: '#474747',
        LoginFormBorder: '#CBD3DF',
        ProfileScreensBg: '#F6F6F6',
        ThemeGreen: '#2C9B00',
        ProfileCardBorder: '#E0E0E0',
        AddressCard: '#F3F3F3',
        LightGrayBg: '#F4F4F4',
        StarGold: '#FFB730',
        AmenitiesLightGray: '#EDEDED',
        BusinessFormLabel: '#959595',
        DashboardGray: '#F5F6FA'
      },
      fontSize: {
        10: '10px',
        20: '20px',
        30: '30px',
        40: '40px',
        50: '50px',
        60: '60px',
        70: '70px',
        80: '80px',
        90: '90px',
        100: '100px'
      },
      boxShadow: {
        customized: '0px 4px 14px 0px rgba(0, 0, 0, 0.15)'
      },
      spacing: {
        "10p": '10px',
        "20p": '20px',
        "30p": '30px',
        "40p": '40px',
        "50p": '50px',
        "60p": '60px',
        "70p": '70px',
        "80p": '80px',
        "90p": '90px',
        "100p": '100px'
      },
      borderRadius: {
        "10p": '10px',
        "20p": '20px',
        "30p": '30px',
        "40p": '40px',
        "50p": '50px',
        "60p": '60px',
        "70p": '70px',
        "80p": '80px',
        "90p": '90px',
        "100p": '100px'
      }
    },
  },
  plugins: [],
}

