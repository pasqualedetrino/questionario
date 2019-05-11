var xmlHTTP = new XMLHttpRequest();

let vett = [];      // matrix of questions and answers
let scorePos;       // object that container the name of radio button and the score
let nDomande = 0;   // number of questions
let totRadio = 0;

/*
-------------------------------------------------------------------------------------------------
                                                used for a test
 */
function writeln(messaggio)
{
    document.write(messaggio + "<br>");
}

function scorepos(name, score) {
    this.name = name;
    this.score = score;

    // method
    this.getInfo = function () {
        let stringa = this.name + " - " + this.score;

        return stringa;
    }
}

// -----------------------------------------------------------------------------------------------

xmlHTTP.onreadystatechange = function()
{
    let nameRadio = 0; // name of Radio

    if(this.readyState ==4 && this.status == 200) { // 4 pagina scaricata, 200 no errore
        var q = JSON.parse(this.responseText);

        var html = "";
        html +="<h1>"+q.title.it+"</h1>";

        document.getElementById("question").innerHTML = html;

        html += "<ol>";
        for(var i in q.questions)
        {
            html += "<li>";
            html += "<h2>" + q.questions[i].question + " </h2>";

            vett[nDomande] = new Array();

            for(var a in q.questions[i].answers)
            {
                html +="<input type=\"radio\" id = " + nameRadio + " />" + q.questions[i].answers[a].answer + "<br/>";
                nameRadio++;
                // collego per ogni id qual è il suo punteggio e il nome della domanda
                scorePos = new scorepos(nameRadio, q.questions[i].answers[a].score);

                vett[nDomande][a] = scorePos;

            }
            html += "</li>";
            nDomande++;
        }

        totRadio = nameRadio;   // number of answer

        html += "</ol>";

        document.getElementById("question").innerHTML = html;

    }
}
xmlHTTP.open("GET", "data.json", true); // true = asincrono perchè usiamo AJAX
xmlHTTP.send(); // invia la request


function check() {
    let nameRadio = 0;
    let score = 0;

    let n = 0;
    let flag = 0;
    let non_risposte = [];
    let answer = totRadio/nDomande;

    for(var i=0;i<nDomande;i++)
    {
        for(var j=0 in vett[i])    // per la dimensione variabile delle risposte
        {
            var radio = document.getElementById(nameRadio);

            if (radio.checked == true)
            {
                if (vett[i][nameRadio%answer].score)
                    score += vett[i][nameRadio%answer].score;

                flag = 1;   // per segnalare che quella domanda ha avuto una risposta
            }

            nameRadio++;
        }
        if(flag == 0) {
            non_risposte.push(i+1);
            n++;
        }
        flag = 0;   // reset on flag value
    }

    // calcolo quante risposte mi aspetto

    if(!non_risposte.length)    // se hai risposto a tutte le domande
        document.getElementById("punteggio").innerHTML = score;
    else
        document.getElementById("punteggio").innerHTML = "non hai risposto alle domande: " + non_risposte;

}
