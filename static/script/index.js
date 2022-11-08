const button_predict = document.querySelector("#btn_submit");
const btn_close = document.getElementById('btn-close')
const input_bahan = document.getElementById('jenis_data_pangan')
const input_date = document.getElementById('date_end')

    
button_predict.addEventListener("click", () => {
    const data = document.querySelector('#jenis_data_pangan');
    const date = document.querySelector(".date_end");
    const xhr = new XMLHttpRequest();
    console.log(date)
    console.log(Date.now())

    const timelapse = Date.now()
    const today = new Date(timelapse)
    console.log(today)

    if (input_bahan.value== '' || input_date.value == ''){
        alert('fill bahan')
    }
    else if(input_date.value == Date.now() || input_date.value == Date.now()){
        alert('isi tanggal setelah hari ini')
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
        xhr.send('bahan='+data.value+'&date='+date.value)
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
            <button id="btn-close">&times;</button>
            <h2>Hasil Prediksi</h2>
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
        document.querySelector('.cards').style.display = 'none';
    })
}