# NewspaperApp - Desktop version (Electronjs v33.2.0)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.4.

## Authors
 - Guillermo Perez Nuñez (EMSE student)
 - Jhon Alexander Rueda Sanchez (EMSE student)
## Development server

For building and running the project use the command 

``` npm run electron ```

## Convert Web App to Desktop App

The application has been tested in all the main desktop systems (Mac, Windows, Linux)
<img width="1440" alt="Mac" src="https://github.com/user-attachments/assets/8374488c-f3b1-413a-9c32-456d6cea3142">
<img width="1440" alt="Ubuntu" src="https://github.com/user-attachments/assets/c6d77119-adfb-4ee6-905e-a63e5c864a58">
<img width="1440" alt="Windows" src="https://github.com/user-attachments/assets/b4f1852d-0704-4e31-a9c3-67faedf181d7">


## Notifications
To enhance the user experience, notifications have been incorporated into the application. They are visible from the initial login and guide the user through different operations, including deletion, updating, and creation.

<img width="1440" alt="Mac_Delete_Notification" src="https://github.com/user-attachments/assets/afe9e36c-888c-4696-a373-c3a62402c970">
<img width="1440" alt="Ubuntu_Field_Error" src="https://github.com/user-attachments/assets/55033e8b-be90-440e-a46a-41273afeaf71">
<img width="1440" alt="Windows_Login_Notification" src="https://github.com/user-attachments/assets/cc0cbc15-7aac-4507-a9b7-b91995a27636">

##  Session Persistence
To streamline the user experience, we're utilizing Electron's electron-store library. This allows us to securely save the user's authentication token locally. This approach eliminates the need for repeated logins upon app startup, providing a seamless and efficient user journey.

## Data Management: Import/Export
The system provides functionality for exporting and importing files. When exporting, files are saved directly to the user's desktop folder.

<img width="1440" alt="Windows_Exported" src="https://github.com/user-attachments/assets/b08d60a3-36bb-423a-bde3-586d68625d7a">
<img width="1440" alt="Ubuntu_Exported" src="https://github.com/user-attachments/assets/423341ed-5a41-4712-91e3-c47eb379a496">
<img width="1440" alt="Mac_Select_file_to_import" src="https://github.com/user-attachments/assets/7977cb48-11a1-41a7-95a5-7a911f48c0e5">
<img width="1440" alt="Mac_File_Successfully_imported" src="https://github.com/user-attachments/assets/229ef069-ec57-40a5-9f93-03d1b5132b76">

## Enhance Desktop Look and Feel
For Look and feel we take some of the techniques like:
- Adding a splash screen
- Adding Menus
- Adding About screen
- Confirmation System Windows style
- The system can automatically detect the user's operating system theme and apply a corresponding light or dark theme to the interface.

<img width="1440" alt="Ubuntu_Splash-screen" src="https://github.com/user-attachments/assets/51bf82d7-6ad2-4426-81e9-4913b7fade1d">
<img width="1440" alt="Windows_splash_Screen" src="https://github.com/user-attachments/assets/c55ce549-5644-4c00-895b-829e2cd4d6e5">
<img width="1440" alt="Mac_Splash_Screen" src="https://github.com/user-attachments/assets/e0f5a5b2-20c5-4f45-ad38-44147e626506">
<img width="1440" alt="Mac_menus" src="https://github.com/user-attachments/assets/411c8f86-3c72-4f25-bc10-41042af3742e">
<img width="1440" alt="Mac_about" src="https://github.com/user-attachments/assets/3b830fae-02f6-4a7f-b626-c2396fa7771c">
