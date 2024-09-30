import chalk from "chalk";

export const TEMPLATES = {
  "acm-website": "https://github.com/acm-ucr/acm-ucr-website",
  "hackathon-website": "https://github.com/acm-ucr/hackathon-website",
  // "calendar-package" : "https://github.com/acm-ucr/calendar"
};
//  export const ACMpackage = "https://github.com/acm-ucr/calendar";

export const QUESTIONS = [
  {
    type: "list",
    name: "template",
    message: `Which ${chalk.blue("ACM template")} would you like to use?`,
    choices: Object.keys(TEMPLATES),
  },
  {
    type: "input",
    name: "projectName",
    message: "What is the name of your project?",
    default: "my-acm-app",
    when: (answers) => answers.template !== "hackathon-website",
  },
  {
    type: "confirm",
    name: "installPackage",
    message: "Do you want to install additional packages?",
    default: false,
    when: (answers) => answers.template === "acm-website",
  },
];

export const PACKAGES = ["express", "mongoose", "cors", "dotenv", "axios"];
