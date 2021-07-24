const shuffle = ([...array]) => {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

function create_table(table_id, dialog){
    var t_re = "";
    let table_title = table_id + "つ目の対話";
    let dialog_id = dialog.id;
    let dialog_turns = dialog.turns;

    t_re += '<table border="1" style="width:100%" align="center">'
    + '<caption>'
    + '<div class="text-center">'
    + '</br></br>'
    + '<h3>'
    + table_title
    + '</h3>'
    + '</div>'
    + '</caption>'
    + '<tbody>'
    + '<th style="width:10%; text-align:center">話者</th>'
    + '<th style="width:70%; text-align:center">発話文</th>'
    + '<th style="width:10%; text-align:center">笑顔度合い</th>'
    + '<th style="width:10%; text-align:center">頷き度合い</th>'

    for (var i = 0; i < dialog_turns.length; i++) {
        var table_tmp = '<tr>'
        if (dialog_turns[i][1] == "system") {
            table_tmp += '<td style = "text-align:center">店員</td>'
            table_tmp += '<td>' + dialog_turns[i][2] + '</td>';
            table_tmp += '<td>'
            + '　<input name="' + dialog_id + '_' + dialog_turns[i][0] + '_smile' + '" type="radio" value="0" />無'
            + '<br>'
            + '　<input name="' + dialog_id + '_' + dialog_turns[i][0] + '_smile' + '" type="radio" value="1" />小'
            + '<br>'
            + '　<input name="' + dialog_id + '_' + dialog_turns[i][0] + '_smile' + '" type="radio" value="2" />中'
            + '<br>'
            + '　<input name="' + dialog_id + '_' + dialog_turns[i][0] + '_smile' + '" type="radio" value="3" />大'
            + '</td>'
            table_tmp += '<td>'
            + '　<input name="' + dialog_id + '_' + dialog_turns[i][0] + '_nod' + '" type="radio" value="0" />無'
            + '<br>'
            + '　<input name="' + dialog_id + '_' + dialog_turns[i][0] + '_nod' + '" type="radio" value="1" />小'
            + '<br>'
            + '　<input name="' + dialog_id + '_' + dialog_turns[i][0] + '_nod' + '" type="radio" value="2" />中'
            + '<br>'
            + '　<input name="' + dialog_id + '_' + dialog_turns[i][0] + '_nod' + '" type="radio" value="3" />大'
            + '</td>'
        }
        else if (dialog_turns[i][1] == "user"){
            table_tmp += '<td style = "text-align:center">客</td>'
            if (dialog_turns[i][2] != "") {
                table_tmp += '<td>'
                + '<p style="background-color:lightgray;margin:2 0px;display:inline-block;">' + dialog_turns[i][2] +'</p>'
                + '<li><input type="text" id="' + dialog_id + "_" + dialog_turns[i][0]+ "_" + dialog_turns[i][1] + "_utterance1" + '" name="' + dialog_id + "_" + dialog_turns[i][0] + "_" + dialog_turns[i][1] + "_utterance1" + '" style="width:90%;margin:2 0px;resize:none" placeholder="1つ目の発話文を入力してください"/></li>'
                + '<li><input type="text" id="' + dialog_id + "_" + dialog_turns[i][0]+ "_" + dialog_turns[i][1] + "_utterance2" + '" name="' + dialog_id + "_" + dialog_turns[i][0] + "_" + dialog_turns[i][1] + "_utterance2" + '" style="width:90%;margin:2 0px;resize:none" placeholder="2つ目の発話文を入力してください"/></li>'
                + '</td>';
            } else {
                table_tmp += '<td></td>'
            }
            table_tmp += '<td>'
            + '</td>'
            + '<td>'
            + '</td>'
        }
        else {
            table_tmp += '<td>'
            + '</td>'
            + '<td>'
            + '</td>'
        }
        t_re += table_tmp;
    }
    return t_re
};

function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    } else {
        pom.click();
    }
};

function submit(table_id) {
    var all_checked = true;
    var text_write = "turn_id,speaker,utterance1,utterance2,smile,nod\n";

    var gender = "";
    var age = "";
    for (var j = 0; j < document.getElementsByName("Gender").length; j++) {
        if (document.getElementsByName("Gender")[j].checked) {
            gender = document.getElementsByName("Gender")[j].value;
        }
    }

    for (var j = 0; j < document.getElementsByName("Age").length; j++) {
        if (document.getElementsByName("Age")[j].checked) {
            age = document.getElementsByName("Age")[j].value;
        }
    }
    
    if(document.getElementById("WorkerID").value==""||age==""||gender==""){
        all_checked = false;
        alert("ワーカーID，性別，年代を入力してください．"); 
        return;
    }
    
    if (!document.getElementById("smile_check").checked){
        alert("笑顔度合いを確認してチェックしてください．");
        all_checked = false;
        return;
    }

    if (!document.getElementById("nod_check").checked){
        alert("頷き度合いを確認してチェックしてください．");
        all_checked = false;
        return;
    }


    const dialog_id = dialog_list[table_id-1].id;
    const dialog_turns = dialog_list[table_id-1].turns;
    for (var i = 0; i < dialog_turns.length; i++) {
        var value_tmp = dialog_turns[i][0]+","+dialog_turns[i][1]+",";

        if (dialog_turns[i][1]=="system"){
            value_tmp += dialog_turns[i][2]+",,"
            var smile_tmp = document.getElementsByName(dialog_id + "_" + dialog_turns[i][0] + "_smile");
            var nod_tmp = document.getElementsByName(dialog_id + "_" + dialog_turns[i][0] + "_nod");
            smile_selected = null;
            nod_selected = null;
            for (var j = 0; j < smile_tmp.length; j++) {
                if (smile_tmp[j].checked) {
                    value_tmp += smile_tmp[j].value+",";
                    smile_selected = smile_tmp[j].value;
                }
            }
            if(smile_selected==null){
                all_checked = false;
                break;
            }
            for (var j = 0; j < nod_tmp.length; j++) {
                if (nod_tmp[j].checked){
                    value_tmp += nod_tmp[j].value;
                    nod_selected = nod_tmp[j].value;
                } 
            }
            if(nod_selected==null){
                all_checked = false;
                break;
            }
        }
        else if (dialog_turns[i][1] == "user"){
            var replace1 = "";
            var replace2 = "";
            if (dialog_turns[i][2] != "") {
                replace1=document.getElementById( dialog_id + "_" + dialog_turns[i][0] + '_' + dialog_turns[i][1]+"_utterance1" ).value;
                replace2=document.getElementById( dialog_id + "_" + dialog_turns[i][0] + '_' + dialog_turns[i][1]+"_utterance2" ).value;
                if(replace1=="" || replace2=="") all_checked = false;
                else value_tmp += replace1 + "," + replace2 + ",,";
            }
            else{
                value_tmp += ",,,";
            }
        }

        text_write += value_tmp + "\n";
    }

    if (all_checked==true) download(table_id+"_"+document.getElementById("WorkerID").value+"_"+age+"_"+gender+"_"+dialog_id+".csv", text_write);
    else alert(dialog_id+"つ目の対話欄に入力されていない項目があります．"); 
};