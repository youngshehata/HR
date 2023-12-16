const { parentPort, workerData } = require("worker_threads");
const vacationTemplate = require("../pdf_templates/vacationTemp");
const text = vacationTemplate(workerData);
const puppeteer = require("puppeteer");

const convertDate = (date) => {
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
};

const generateVacationsLetter = async () => {
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setContent(text);
    await page.emulateMediaType("screen");
    const nowDate = convertDate(new Date());
    const milliseconds = new Date().getTime();
    await page.pdf({
      format: "A4",
      path: `./letters/vacation/${workerData.name}-${nowDate}-${milliseconds}.pdf`,
      printBackground: true,
    });
    await browser.close();

    parentPort.postMessage(
      `./letters/vacation/${workerData.name}-${nowDate}-${milliseconds}.pdf`
    );
  } catch (error) {
    parentPort.emit(
      "messageerror",
      `Error occured while generating pdf - ${error.message}`
    );
    console.log(error);
  }
};
generateVacationsLetter();
