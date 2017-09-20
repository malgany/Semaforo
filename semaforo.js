$( document ).ready(function() {
                //Cria a box no
                $("body").append("<div id='box'></div>");
                $("#box").append("<div id='car'></div>");
                $("body").append("<div id='quadroLog'></div>");

                //Movimentando
                var parou_no_semaforo = false;

                //Array do log
                var log = new Array();
                log["1p7"] = new Array();
                log["1p13"] = new Array();
                log["7p1"] = new Array();
                log["7p7"] = new Array();
                log["7p13"] = new Array();
                log["7p18"] = new Array();
                log["12p1"] = new Array();
                log["12p7"] = new Array();
                log["12p13"] = new Array();
                log["12p18"] = new Array();
                log["18p7"] = new Array();
                log["18p13"] = new Array();

                var id_semaforos = ["1p7", "1p13", "7p1", "7p7", "7p13", "7p18", "12p1", "12p7", "12p13", "12p18", "18p7", "18p13"];

                //Cria o Mapa
                criaCidade();

                //Posiciona carro
                var pos_x = pos_y = ant_x = ant_y = 1;
                posCarro();

                //Velocidade
                var speed = 550;

                // Um loop de animação básico
                requestAnimationFrame(animar);

                //Request
                var request = setInterval(animar, speed);
                function animar() {
                    // valida se está se movimentando
                    movimento();
                }

                function paraAnimacao() {
                    clearInterval(request);
                }

                function movimento() {
                    var posicoes = posicoesPossiveis();
                    var idPos = posicoes[random(posicoes.length)];
                    var direcao = idPos.slice(-1);
                    idPos = idPos.slice(0, -1);
                    if(temSemaforoAberto(idPos)){
                        guardaLog(idPos, direcao);
                        movePara(idPos);
                    } else {
                        parou_no_semaforo = true;
                    }
                }

                function temSemaforoAberto(pos) {
                    if(pos != "" && pos != undefined) {
                        var arraypos = pos.split("p");
                        // CIMA
                        if((parseInt(pos_x)-1) == arraypos[0] && pos_y == arraypos[1]){
                            if($("#"+pos).css("border-bottom-color") == "rgb(255, 0, 0)"){
                                return false;
                            }
                        }
                        // ESQUERDA
                        if(pos_x == arraypos[0] && (parseInt(pos_y)+1) == arraypos[1]){
                            if($("#"+pos).css("border-left-color") == "rgb(255, 0, 0)"){
                                return false;
                            }
                        }
                        // DIREITA
                        if(pos_x == arraypos[0] && (parseInt(pos_y)-1) == arraypos[1]){
                            if($("#"+pos).css("border-right-color") == "rgb(255, 0, 0)"){
                                return false;
                            }
                        }
                        // BAIXO
                        if((parseInt(pos_x)+1) == arraypos[0] && pos_y == arraypos[1]){
                            if($("#"+pos).css("border-top-color") == "rgb(255, 0, 0)"){
                                return false;
                            }
                        }
                    }
                    return true;
                }

                function movePara(pos) {
                    if(pos != "" && pos != undefined) {
                        var arraypos = pos.split("p");
                        ant_x = pos_x;
                        ant_y = pos_y;
                        pos_x = arraypos[0];
                        pos_y = arraypos[1];

                        $("#car").animate({
                            top: $("#"+pos).position().top+"px",
                            left: $("#"+pos).position().left+"px"
                        }, {duration: speed, easing: "linear"});
                    }
                }

                function random(quantidade) {
                    return (Math.floor((Math.random() * quantidade) + 1) - 1);
                }

                function posicoesPossiveis() {
                    var possiveis = new Array();

                    // CIMA
                    if(obstacles[(parseInt(pos_x)-1)+"p"+pos_y] == 0 && ((parseInt(pos_x)-1) != ant_x || pos_y != ant_y)){
                        possiveis.push((parseInt(pos_x)-1)+"p"+pos_y+"c");
                    }
                    //ESQUERDA
                    if(obstacles[pos_x+"p"+(parseInt(pos_y)-1)] == 0 && (pos_x != ant_x || (parseInt(pos_y)-1) != ant_y)){
                        possiveis.push(pos_x+"p"+(parseInt(pos_y)-1)+"e");
                    }
                    //DIREITA
                    if(obstacles[pos_x+"p"+(parseInt(pos_y)+1)] == 0 && (pos_x != ant_x || (parseInt(pos_y)+1) != ant_y)){
                        possiveis.push(pos_x+"p"+(parseInt(pos_y)+1)+"d");
                    }
                    //BAIXO
                    if(obstacles[(parseInt(pos_x)+1)+"p"+pos_y] == 0 && ((parseInt(pos_x)+1) != ant_x || pos_y != ant_y)){
                        possiveis.push((parseInt(pos_x)+1)+"p"+pos_y+"b");
                    }
                    return possiveis;
                }

                function posCarro() {
                    $("#car").css("top", $("#1p1").position().top+"px");
                    $("#car").css("left", $("#1p1").position().left+"px");
                }

                function guardaLog(idPos, direcao){
                    if(parou_no_semaforo) {
                        parou_no_semaforo = false;
                        log[idPos].push(["|"+direcao,  horaJs()]);

                        var htm = "";
                        id_semaforos.forEach(function(val, index){

                            htm+= "<b>"+val+"</b> = "+log[val].toString()+" - <br>";
                        });
                        htm = htm.replace(/,/g, ": ");
                        $("#quadroLog").html(htm);
                    }
                }

                function horaJs() {
                    var data = new Date();
                    var hora = pad(data.getHours(), 2);
                    var min = pad(data.getMinutes(), 2);
                    var seg = pad(data.getSeconds(), 2);

                    return hora + ':' + min + ':' + seg;
                }

                function pad(str, length) {
                    const resto = length - String(str).length;
                    return '0'.repeat(resto > 0 ? resto : '0') + str;
                }

                var blob = new Blob([document.querySelector('#worker1').textContent]);
                var worker = new Worker(window.URL.createObjectURL(blob));
                worker.onmessage = function(e) {
                    if(e.data.semaforo == 1) {
                        $("#1p7").html("<label>"+e.data.semaforo+"</label>")
                        $("#1p7").css("border-left-color", e.data.cor);
                        $("#1p7").css("border-right-color", e.data.cor);
                        $("#1p7").css("border-bottom-color", e.data.cor2);
                    }
                    if(e.data.semaforo == 2) {
                        $("#1p13").html("<label>"+e.data.semaforo+"</label>")
                        $("#1p13").css("border-left-color", e.data.cor);
                        $("#1p13").css("border-right-color", e.data.cor);
                        $("#1p13").css("border-bottom-color", e.data.cor2);
                    }
                    if(e.data.semaforo == 3) {
                        $("#7p1").html("<label>"+e.data.semaforo+"</label>")
                        $("#7p1").css("border-top-color", e.data.cor);
                        $("#7p1").css("border-right-color", e.data.cor2);
                        $("#7p1").css("border-bottom-color", e.data.cor);
                    }
                    if(e.data.semaforo == 4) {
                        $("#7p7").html("<label>"+e.data.semaforo+"</label>")
                        $("#7p7").css("border-top-color", e.data.cor);
                        $("#7p7").css("border-bottom-color", e.data.cor);
                        $("#7p7").css("border-left-color", e.data.cor2);
                        $("#7p7").css("border-right-color", e.data.cor2);
                    }
                    if(e.data.semaforo == 5) {
                        $("#7p13").html("<label>"+e.data.semaforo+"</label>")
                        $("#7p13").css("border-top-color", e.data.cor);
                        $("#7p13").css("border-bottom-color", e.data.cor);
                        $("#7p13").css("border-left-color", e.data.cor2);
                        $("#7p13").css("border-right-color", e.data.cor2);
                    }
                    if(e.data.semaforo == 6) {
                        $("#7p18").html("<label>"+e.data.semaforo+"</label>")
                        $("#7p18").css("border-top-color", e.data.cor);
                        $("#7p18").css("border-bottom-color", e.data.cor);
                        $("#7p18").css("border-left-color", e.data.cor2);
                    }
                    if(e.data.semaforo == 7) {
                        $("#12p1").html("<label>"+e.data.semaforo+"</label>")
                        $("#12p1").css("border-top-color", e.data.cor);
                        $("#12p1").css("border-right-color", e.data.cor2);
                        $("#12p1").css("border-bottom-color", e.data.cor);
                    }
                    if(e.data.semaforo == 8) {
                        $("#12p7").html("<label>"+e.data.semaforo+"</label>")
                        $("#12p7").css("border-top-color", e.data.cor);
                        $("#12p7").css("border-bottom-color", e.data.cor);
                        $("#12p7").css("border-left-color", e.data.cor2);
                        $("#12p7").css("border-right-color", e.data.cor2);
                    }
                    if(e.data.semaforo == 9) {
                        $("#12p13").html("<label>"+e.data.semaforo+"</label>")
                        $("#12p13").css("border-top-color", e.data.cor);
                        $("#12p13").css("border-bottom-color", e.data.cor);
                        $("#12p13").css("border-left-color", e.data.cor2);
                        $("#12p13").css("border-right-color", e.data.cor2);
                    }
                    if(e.data.semaforo == 10) {
                        $("#12p18").html("<label>"+e.data.semaforo+"</label>")
                        $("#12p18").css("border-top-color", e.data.cor);
                        $("#12p18").css("border-bottom-color", e.data.cor);
                        $("#12p18").css("border-left-color", e.data.cor2);
                    }
                    if(e.data.semaforo == 11) {
                        $("#18p7").html("<label>"+e.data.semaforo+"</label>")
                        $("#18p7").css("border-top-color", e.data.cor);
                        $("#18p7").css("border-left-color", e.data.cor2);
                        $("#18p7").css("border-right-color", e.data.cor2);
                    }
                    if(e.data.semaforo == 12) {
                        $("#18p13").html("<label>"+e.data.semaforo+"</label>")
                        $("#18p13").css("border-top-color", e.data.cor);
                        $("#18p13").css("border-left-color", e.data.cor2);
                        $("#18p13").css("border-right-color", e.data.cor2);
                    }
                }
                worker.postMessage(""); // Start the worker.
            });