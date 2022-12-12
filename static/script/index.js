const humbergerswitch = document.querySelector('.menu-switch')
const navbar = document.querySelector('.ul-list')

humbergerswitch.addEventListener("click", () => {
    humbergerswitch.classList.toggle('active');
    navbar.classList.toggle('active');
})


function updatebg(){
    const dhour = (new Date()).getHours()
    const body = document.getElementById('home')
    const bbody = body.style

    if (dhour < 10){
        bbody.background = "url('/static/pagi-01.svg')"
        bbody.backgroundSize = 'cover'
    } else if(dhour < 15){
        bbody.background = "url('/static/siang-01.svg')"
        bbody.backgroundSize = 'cover'
    } else{
        bbody.background = "url('/static/bg.svg')"
        bbody.backgroundSize = 'cover'
    }
}

setInterval(updatebg, 1000 * 60)
updatebg();

const button_predict = document.querySelector("#btn_submit");
const btn_close = document.getElementById('btn-close')
const input_bahan = document.getElementById('jenis_data_pangan')
const input_date = document.getElementById('date_end')

    
button_predict.addEventListener("click", () => {
    const xhr = new XMLHttpRequest();
    
    const datenow = new Date()

    const formating = (date)=> {
        let dates = new Date(date),
        month = '' + (dates.getMonth() + 1),
        day = '' + dates.getDate(),
        year = dates.getFullYear();

        return [year, month, day].join('-')
    }

    console.log(formating(datenow))

    if(input_date.value < formating(datenow)){
        console.log(input_date.value, formating(datenow))
        alert('isi tanggal setelah tanggal hari ini')
    }
    else if(input_date.value == formating(datenow)){
        alert('isi tanggal setelah tanggal hari ini')
    }
    else if (input_bahan.value == '' || input_date.value == ''){
        alert('isi jenis bahan pangan dan tanggal waktu ingin prediksi harga')
    }
    else{
        xhr.onloadstart= () => {
            document.querySelector('.spiner-page').style.display ='block'
            input_bahan.disabled = true
            input_date.disabled = true
            document.querySelector("#btn_submit").disabled = true
        }
    
        xhr.onloadend = () => {
            document.querySelector('.spiner-page').style.display= 'none'
            input_bahan.disabled = false
            input_date.disabled = false
            input_bahan.value = ""
            input_date.value = ""
            document.querySelector("#btn_submit").disabled = false
        }
    
        xhr.onreadystatechange = () =>{
            if (xhr.readyState == 4){
                getData()
            }
        }
    
        xhr.open('POST', '/predict', true)
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        xhr.send('bahan='+input_bahan.value+'&date='+input_date.value)
    }
})

const getData = () => {
    const xhr = new XMLHttpRequest()
    xhr.onload = function() {
        const responseText = JSON.parse(this.responseText);
        rendervalue(responseText)
    }

    xhr.onerror = () => {
        console.log(error)
    }

    xhr.open('GET', '/predict')
    xhr.send()
}

const rendervalue =(msg) => {
    const date = document.querySelector(".date_end");
    const card = document.querySelector('.value')
    card.innerHTML = `
    <div class="cards">
      <div class="card-popup">
        <div class="up">
            <h2>Hasil Prediksi</h2>
            <button id="btn-close">&times;</button>
        </div>
          <img src="/plot" alt="plot predict">
          <div id='chart'></div>
          
          <div class="line"></div>
          <p>Prediksi harga ${msg.jenis_bahan}</p>
          <p id="value">
              pada tanggal ${msg.date} adalah RP${msg.predict}
          </p>
      </div>
  </div>
    `
    const btn_close = document.getElementById('btn-close')
    btn_close.addEventListener('click', () => {
        // document.querySelector('.cards').style.display = 'none';
        window.location.reload();
    })
}