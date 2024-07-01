export default class End extends Phaser.Scene {
    constructor() {
      super("end");
    }
  
    init(data) {
      console.log("data", data);
      this.score = data.score || 0;
      this.gameOver = data.gameOver;
      console.log(this.gameOver);
    }
  
    preload() {
      this.load.image("gover", "./public/gameover.png");
    }

    create() {

      this.add.image(600, 300, "gover");

      // Tecla R para reiniciar
      this.r = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
  
      // Mostrar puntaje
      this.add.text(600, 360, `PUNTOS: ${this.score}`, {
        fontSize: "32px",
        color: "#000000",
      }).setOrigin(0.5);
      // Mostrar puntaje
      this.add.text(600, 400, `Presiona "R" para reiniciar`, {
        fontSize: "20px",
        color: "#000000",
      }).setOrigin(0.5);
    }
  
    update() {
      // Reiniciar el juego al presionar la tecla R
      if (Phaser.Input.Keyboard.JustDown(this.r)) {
        const mainScene = this.scene.get("main");
        if (mainScene.backgroundMusic.isPlaying) {
          mainScene.backgroundMusic.stop();
        }
        this.scene.stop("end");
        this.scene.start("menu");
      }
    }
  }