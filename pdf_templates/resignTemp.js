const convertDate = (date) => {
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
};

const nowDate = convertDate(new Date());
const tommorowDate = new Date().setDate(new Date().getDate() + 1);
const tommorow = convertDate(new Date(tommorowDate));

module.exports = (data) => {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vacation</title>
      </head>
      <style>
        body {
          height: auto;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          margin: 10px 10px;
          padding: 0;
          overflow: scroll;
          -ms-overflow-style: none; /* Internet Explorer 10+ */
          scrollbar-width: none; /* Firefox */
          transition: all 0.3s ease-in-out;
          scroll-behavior: smooth;
          font-family: "Calibri", "Gill Sans", "Gill Sans MT", "Trebuchet MS",
            sans-serif;
        }
        body::-webkit-scrollbar {
          display: none; /* Safari and Chrome */
        }
    
        p {
          margin: 0;
          padding: 0;
        }
        h1,
        h2,
        h3,
        h4 {
          font-weight: 500;
          text-align: inherit;
          width: 100%;
        }
    
        .agazaMainContainer {
          position: relative;
          font-size: 1rem;
          font-family: "Calibri", "Gill Sans", "Gill Sans MT", "Trebuchet MS",
            sans-serif;
          display: flex;
          flex-direction: column;
          height: 275mm; /*-20 for printing with borders */
          width: 185mm; /*-20 for printing with borders */
          border: 0.2vmax #000 solid;
          border-radius: 0.5vmax;
          justify-content: flex-start;
          align-items: center;
        }
    
        header {
          position: relative;
          height: 10%;
          width: 90%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
    
        .headerLine {
          height: 3%;
          width: 50%;
          background-color: #000;
          border-radius: 3vmax;
        }
        .firstLine {
          width: 10%;
        }
        .headerText {
          font-size: 1.5vmax;
          padding: 0.25vmax 0.5vmax;
        }
    
        .bodySection {
          width: 80%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: start;
        }
    
        .coloredSpan {
          font-weight: 600;
        }
        .breakLine {
          width: 100%;
          margin: 2vmax;
          height: 5px;
          border-top: 0.3vmax rgb(180, 180, 180) dashed;
        }
      </style>
      <body>
        <main class="agazaMainContainer">
          <header>
            <div class="headerLine firstLine"></div>
            <span class="headerText">Vacation Letter</span>
            <div class="headerLine"></div>
          </header>
          <section class="bodySection">
            <h1 class="dearManager">Dear chief executive officer...</h1>
            <h1 class="dearManager">${data.ceo}</h1>
            <br />
            <h3 class="letterItself">
             Please accept this letter as my formal resignation
             <br/>
             from my postion as ${data.title} on ${data.section} section
             <br/>
             my last day of work will be ${tommorow}
            </h3>
            <p>Please let me know if there is anything i can do to assist with this transition</p>
            <h4>Todays Date: ${nowDate}</h4>
            <div class="breakLine"></div>
            <h3>Section administrator:</h3>
            <h4>[${data.section}]</h4>
            <p style="text-align: start; width: 100%">${data.administrator}</p>
            <br />
            <br />
            <h3>Your employee:</h3>
            <h2>${data.name}</h2>
          </section>
        </main>
      </body>
    </html>
    `;
};
