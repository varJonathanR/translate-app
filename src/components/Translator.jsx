import React, { useEffect } from 'react'
import Countries from './Data';
import { Change, Sound, Copy, Translate } from '../assets/SVGs'

export default function Translator() {
    useEffect(() => {
        const toTranslate = document.getElementById("toTranslate");
        const translatedText = document.getElementById("translatedText");
        const translateBtn = document.getElementById("translateBtn");
        const exchangeBtn = document.getElementById("exchangeBtn");
        const selectTag = document.querySelectorAll("select");
        const actions = document.querySelectorAll("button");
        
        /* const eng1 = document.getElementById("englishFrom");
        const eng2 = document.getElementById("englishTo");
        const es1 = document.getElementById("spanishFrom");
        const es2 = document.getElementById("spanishTo");

        let quickFromLang;
        let quickToLang; */

        selectTag.forEach((tag, id) => {
            for(let countryCode in Countries) {
                let selected = id === 0 
                    ? countryCode === "en-GB"
                        ? "selected"
                        : ""
                    : countryCode === "es-ES"
                        ? "selected"
                        : "";

                let option = `<option ${selected} value="${countryCode}">${Countries[countryCode]}</option>`;
                tag.insertAdjacentHTML("beforeend" ,option);
            }
        });

        exchangeBtn.addEventListener("click", () => {
            let tempText = toTranslate.value;
            let lang = selectTag[0].value;
            toTranslate.value = translatedText.value;
            translatedText.value = tempText;
            selectTag[0].value = selectTag[1].value;
            selectTag[1].value = lang;
        });

        toTranslate.addEventListener("keyup", () => {
            translatedText.value = !translatedText.value ? "" : translatedText.value;
        });

        translateBtn.addEventListener("click", () => {
            let text = toTranslate.value.trim();
            let translateFrom = selectTag[0].value;
            let translateTo = selectTag[1].value;
            console.log(translateFrom, translateTo);
            
            if(!text) return;
            translatedText.setAttribute("placeholder", "Translating...");

            let apiURL = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;

            fetch(apiURL)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    translatedText.value = data.responseData.translatedText;
                    translatedText.setAttribute("placeholder", "Translation");
                })
                .catch(error => console.log("Error:", error));
        });

        actions.forEach(a => {
            a.addEventListener("click", ({ target }) => {
                const button = target.closest("button");

                /* Default languajes and quick languaje */
                /* if(button.classList.contains("english")) {
                    if(button.id === "englishFrom") {
                        quickFromLang = eng1.value;
                        eng1.classList.toggle("active");
                    } else if(button.id === "englishTo") {
                        quickFromLang = eng2.value;
                        eng2.classList.toggle("active");
                    }
                } else if(button.classList.contains("spanish")) {
                    if(button.id === "spanishFrom") {
                        quickToLang = es1.value;
                        es1.classList.toggle("active");
                    } else if(button.id === "englishTo") {
                        quickToLang = es2.value;
                        es2.classList.toggle("active");
                    }
                } */

                /* Copy content and speech */
                if(!toTranslate.value || !translatedText.value) return;
                if(button && button.classList.contains("copy")) {
                    if(button.id === "copyFrom") navigator.clipboard.writeText(toTranslate.value);
                    else if(button.id === "copyTo") navigator.clipboard.writeText(translatedText.value);
                } else if(button && button.classList.contains("speak")) {
                    let utterance;
                    if(button.id === "speakFrom") {
                        utterance = new SpeechSynthesisUtterance(toTranslate.value);
                        utterance.lang = selectTag[0].value;
                    } else if(button.id === "speakTo") {
                        utterance = new SpeechSynthesisUtterance(translatedText.value);
                        utterance.lang = selectTag[1].value;
                    }
                    speechSynthesis.speak(utterance);
                }
            });
        });
    }, []); 

    return (
        <section className="trasnlator-container">
            <section className="translator">
                <div className="translator-languajes">
                    <button className="detectLanguaje">Detect Languaje</button>
                    <button id="englishFrom" className="english" value="en-GB">English</button>
                    <button id="spanishTo" className="spanish" value="es-ES">Spanish</button>
                    <select id=""></select>
                </div>
                <hr />
                <form action="" className="input-form">
                    <textarea 
                        id="toTranslate" 
                        className="textarea"
                        spellCheck="false"
                        placeholder='Enter text ...'
                        maxLength={500}
                        
                    ></textarea>
                </form>
                <div className="control-panel">
                    <div className="btn-container">
                        <button id='speakFrom' className="icon-btn speak"><Sound /></button>
                        <button id='copyFrom' className="icon-btn copy"><Copy /></button>
                    </div>
                    <button id='translateBtn' className="translate-btn"><Translate />Translate</button>
                </div>
            </section>
            <div className="translator">
                <div className="translator-languajes space">
                    <div className="second-panel">
                        <button id="englishTo" className="english" value="en-GB">English</button>
                        <button id="spanishTo" className="spanish" value="es-ES">Spanish</button>
                        <select id=""></select>
                    </div>
                    <button id='exchangeBtn' className='icon-btn'>
                        <Change />
                    </button>
                </div>
                <hr />
                <textarea 
                        readOnly
                        disabled
                        id="translatedText" 
                        className="textarea"
                        placeholder='Translated text'
                        maxLength={500}
                ></textarea>
                <div className="control-panel">
                    <div className="btn-container">
                        <button id='speakTo' className="icon-btn speak"><Sound /></button>
                        <button id='copyTo' className="icon-btn copy"><Copy /></button>
                    </div>
                </div>
            </div>
        </section>
    )
}
