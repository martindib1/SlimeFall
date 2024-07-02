export default class Config extends Phaser.Scene {
    constructor() {
      super("configuracion");
    }

    preload() {
        // Cargar assets
        this.load.image("fondoconfig", "./public/configfondo.png");
        this.load.image("botonvolver", "./public/volver.png"); // Cargar la imagen del botón
    }

    create() {
        // Fondo
        this.add.image(600, 300, "fondoconfig");
        // Botón volver al menu
      const volver = this.add.image(600, 470, "botonvolver").setScale(1).setInteractive();

      // Escalar el botón cuando el cursor esté sobre él
      volver.on('pointerover', () => {
        volver.setScale(1.2);
    });
    // Restaurar la escala original cuando el cursor salga del botón
    volver.on('pointerout', () => {
        volver.setScale(1);
    });
    // Agregar evento al botón para volver
    volver.on('pointerdown', () => {
        this.scene.start('menu');
    });
    }
}