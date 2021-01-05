// CatsPets88@yandex.ru
// Intel409651!!!
const { randSleep, waitClick } = require("../utils");

const loginYandex = async (page, email, pass) => {
  const enterButton = ".passp-sign-in-button > button";
  const userAvatar =
    "#root a.user-account.user-account_has-ticker_yes.user-account_has-accent-letter_yes.legouser__current-account.i-bem > div > img";
  await page.goto("https://passport.yandex.ru/auth/list");
  await randSleep();
  let isAvatar = null;

  try {
    isAvatar = await page.waitForSelector(
      userAvatar,
      (options = { timeout: 5000 })
    );
  } catch (err) {}

  try {
    await page.click(enterButton);
    await randSleep();
  } catch (er) {}

  try {
    await page.$eval("#passp-field-login", (el) => (el.value = ""));
    await randSleep();
  } catch (er) {}

  try {
    await page.$eval("#passp-field-passwd", (el) => (el.value = ""));
    await randSleep();
  } catch (er) {}

  if (!isAvatar) {
    try {
      await page.evaluate(async () => {
        const rr = document.querySelector(`a.AddAccountButton`);
        await rr.click();
        await randSleep();
      });
    } catch (err) {}

    try {
      const emailSelector = await page.waitForSelector("#passp-field-login");
      await emailSelector.type(email);
      const b = await page.waitForSelector(
        enterButton,
        (options = { timeout: 5000 })
      );
      await randSleep();
      await b.click();
    } catch (err) {}

    try {
      const b = await page.waitForSelector("#passp-field-passwd");
      await b.type(pass);
      await randSleep();
      const [nextPassButton] = await page.$x("//button[contains(., 'Войти')]");
      await nextPassButton.click();
      await randSleep();
    } catch (err) {}

    await randSleep();

    try {
      await randSleep();
      // Not connect phome number
      await waitClick(
        page,
        "#root > div > div.passp-page > div.passp-flex-wrapper > div > div > div.passp-auth-content > div.passp-route-forward > div > div > form > div:nth-child(3) > button"
      );
      await randSleep();
    } catch (err) {}

    try {
      isAvatar = await page.waitForSelector(
        userAvatar,
        (options = { timeout: 5000 })
      );
    } catch (err) {}
  } else {
    console.log("isOn");
  }
};

const loginGoogle = async (page) => {
  await page.goto("https://youtube.com");
  const [button] = await page.$x("//paper-button[contains(., 'Sign in')]");
  if (button) {
    await button.click();

    await randSleep();
    let [another] = await page.$x("//div[contains(., 'Use another account')]");

    if (another) {
      await another.click();
    }
    await randSleep();
    [another] = await page.$x("//div[contains(., 'Use another account')]");

    if (another) {
      await another.click();
    }

    await randSleep();
    await page.waitForSelector("input[name=identifier]");
    await page.$eval(
      "input[name=identifier]",
      (el) => (el.value = "ivan.nepomnyashiy.87")
      // (el) => (el.value = "funny.cats.me.88")
    );
    await randSleep();

    const [nextButton] = await page.$x("//button[contains(., 'Next')]");
    await nextButton.click();
    await randSleep();
    await page.waitForSelector("input[name=password]");
    await page.$eval(
      "input[name=password]",
      (el) => (el.value = "Intel409651!!!")
    );
    const [nextPassButton] = await page.$x("//button[contains(., 'Next')]");
    await randSleep();
    await nextPassButton.click();
    await randSleep();
  }
  return page;
};
module.exports = {
  loginYandex,
  loginGoogle,
};
