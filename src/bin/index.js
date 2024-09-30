#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import simpleGit from "simple-git";
import path from "path";
import os from "os";
import { TEMPLATES, QUESTIONS, PACKAGES } from "../contants.js";
import { exec } from "child_process";
import figlet from "figlet";

const git = simpleGit();

// console.log(chalk.blue("ACM Templates"));

async function displayHeader() {
  return new Promise((resolve, reject) => {
    figlet("ACM Templates", (err, data) => {
      if (err) {
        return reject(err);
      }
      console.log(chalk.blueBright(data));
      resolve();
    });
  });
}

async function run() {
  try {
    await displayHeader();

    const answers = await inquirer.prompt(QUESTIONS);
    let { template, projectName } = answers;

    const repoUrl = TEMPLATES[template];
    if (!repoUrl) {
      throw new Error(`Template ${template} does not exist!`);
    }
    //Install Hackathon
    if (template === "hackathon-website") {
      projectName = "hackathon-website";
      console.log(
        chalk.green(
          `Detected hackathon-website. Skipping project name prompt and using default: ${projectName}`,
        ),
      );
    }

    const selectedPackages = [];
    if (template === "acm-website") {
      for (const pkg of PACKAGES) {
        const { install } = await inquirer.prompt({
          type: "confirm",
          name: "install",
          message: `Do you want to install ${pkg}?`,
          default: false,
        });

        if (install) {
          selectedPackages.push(pkg);
        } else {
          console.log(chalk.yellow(`Skipped installation of ${pkg}.`));
        }
      }
    }

    const homeDir = os.homedir();
    const targetDir = path.join(homeDir, projectName);

    console.log(`Cloning ${template} into ${targetDir} from ${repoUrl}...`);
    await git.clone(repoUrl, targetDir);

    console.log(
      `Successfully created ${projectName} from ${template} at ${targetDir}!`,
    );

    // Install selected packages
    if (selectedPackages.length > 0) {
      for (const pkg of selectedPackages) {
        console.log(chalk.yellow(`Installing ${pkg}...`));
        await new Promise((resolve, reject) => {
          exec(
            `cd ${targetDir} && npm install ${pkg}`,
            (error, stdout, stderr) => {
              if (error) {
                console.error(
                  chalk.red(`Error installing package: ${error.message}`),
                );
                return reject(error);
              }
              console.log(chalk.green(`Successfully installed ${pkg}!`));
              console.log(stdout);
              resolve();
            },
          );
        });
      }
    } else {
      console.log(chalk.yellow("No packages selected for installation."));
    }
  } catch (error) {
    console.error("Error occurred:", error.message);
  }
}

run();
