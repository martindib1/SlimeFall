export default class Menu extends Phaser.Scene {
  constructor() {
      super("menu");
  }

  preload() {
      // Cargar assets
      this.load.image("menup", "./public/menup.png");
      this.load.image("config", "./public/config.png");
      this.load.image("boton", "./public/boton.png"); // Cargar la imagen del botón
      this.load.audio('menumusic', ['./public/musicmenu.mp3']);
  }

  create() {
      // Fondo del menú
      this.add.image(600, 300, "menup");

      // Botón para comenzar el juego
      const boton = this.add.image(600, 330, "boton").setScale(1).setInteractive();
      //boton para abrir la configuracion
      const configb = this.add.image(600, 400, "config").setScale(1).setInteractive();

      // Verificar si la música está sonando
      if (!this.musicafondo || !this.musicafondo.isPlaying) {
          // Agregar música de fondo
          this.musicafondo = this.sound.add('menumusic', { loop: true, volume: 0.2 });
          this.musicafondo.play();
      }

      // Escalar el botón cuando el cursor esté sobre él (el de config)
      configb.on('pointerover', () => {
        configb.setScale(1.2);
      });
    
       // Restaurar la escala original cuando el cursor salga del botón (el de config)
       configb.on('pointerout', () => {
        configb.setScale(1);
       });

      // Escalar el botón cuando el cursor esté sobre él
      boton.on('pointerover', () => {
          boton.setScale(1.2);
      });

      // Restaurar la escala original cuando el cursor salga del botón
      boton.on('pointerout', () => {
          boton.setScale(1);
      });

      // Agregar evento al botón para comenzar el juego
      configb.on('pointerdown', () => {
        this.scene.start('configuracion');
    });

      // Agregar evento al botón para comenzar el juego
      boton.on('pointerdown', () => {
          this.musicafondo.stop(); // Detener la música de fondo
          this.scene.start('main');
      });
  }
}