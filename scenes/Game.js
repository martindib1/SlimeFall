export default class Game extends Phaser.Scene {
  constructor() {
    super("main");
  }

  init() {
    this.gameOver = false;
    this.score = 0;
    this.life = 3;
    this.balasDisponibles = 10; // Nueva propiedad para almacenar el número de balas disponibles
    this.lastDirection = 'right'; // Nueva propiedad para rastrear la última dirección
    this.shapes = {
      "slimeverde": { points: 20,},
      "slimenaranja": { points: 20,},
      "slimerosa": { points: 20,},
      "slimerojo": { points: 20,},
      "slimevioleta": { points: 20,}
    };
  }

  preload() {
    // Cargar assets
    this.load.image("cielo", "./public/fondo.png");
    this.load.image("plataforma", "./public/piso.png");
    this.load.spritesheet("personaje", "./public/pj96x124.png", {
      frameWidth: 96,
      frameHeight: 124
    });
    this.load.spritesheet("splash", "./public/splash-2Sheet46x41.png", {
      frameWidth: 46,
      frameHeight: 41
    });
    this.load.image("slimeverde", "./public/slimeverde.png");
    this.load.image("slimerosa", "./public/slimerosa.png");
    this.load.image("slimerojo", "./public/slimerojo.png");
    this.load.image("slimenaranja", "./public/slimenaranja.png");
    this.load.image("slimevioleta", "./public/slimevioleta.png");
    this.load.image("bala", "./public/bombucha2.png");
    this.load.image("cajapuntos", "./public/puntos.png");
    this.load.image("cajavida", "./public/vidas.png");
    this.load.image("cajabalas", "./public/balas.png");
    this.load.image("baldebalas", "./public/baldebombuchas.png");
    this.load.audio('backmusic', ['./public/italiana.mp3']);
  }

  create() {
    // Crear grupo de balas
    this.balas = this.physics.add.group();

    // Evento para disparar al hacer click
    this.input.on('pointerdown', this.disparar, this);

    // Verificar si la música está sonando
    if (!this.backgroundMusic || !this.backgroundMusic.isPlaying) {
      // Agregar música de fondo
      this.backgroundMusic = this.sound.add('backmusic', { loop: true, volume: 0.2 });
      this.backgroundMusic.play();
    }

    // Crear cielo y ajustarlo
    this.cielo = this.add.image(600, 300, "cielo");

    // Crear grupo de plataformas
    this.plataformas = this.physics.add.staticGroup();
    this.plataformas.create(600, 582, "plataforma").refreshBody();

    // Crear personaje con sprite sheet
    this.personaje = this.physics.add.sprite(500, 500, "personaje").setScale(1);
    this.personaje.setCollideWorldBounds(true);

    // Definir animaciones del personaje
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('personaje', { start: 9, end: 0 }),
      frameRate: 7,
      repeat: -1
    });

    this.anims.create({
      key: 'turnLeft',
      frames: [{ key: 'personaje', frame: 9 }],
      frameRate: 20
    });

    this.anims.create({
      key: 'turnRight',
      frames: [{ key: 'personaje', frame: 10 }],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('personaje', { start: 10, end: 19 }),
      frameRate: 7,
      repeat: -1
    });

    //Definir animacion del splash
    this.anims.create({
      key: 'endsplash',
      frames: this.anims.generateFrameNumbers('splash', { start: 0, end: 2 }),
      frameRate: 30,
    });

    // Agregar colisión entre personaje y plataforma
    this.physics.add.collider(this.personaje, this.plataformas);

    // Crear teclas
    this.cursor = this.input.keyboard.createCursorKeys();

    // Crear grupo de recolectables
    this.recolectables = this.physics.add.group();
    this.physics.add.collider(this.recolectables, this.recolectables);
    this.physics.add.collider(this.personaje, this.recolectables, this.collectItem, null, this);
    this.physics.add.collider(this.plataformas, this.recolectables, this.onRecolectableBounced, null, this);

    // Evento cada 1 segundo para crear recolectables
    this.time.addEvent({
      delay: 1000,
      callback: this.onSecond,
      callbackScope: this,
      loop: true,
    });

    // Evento cada 5 segundos para crear balde de balas
    this.time.addEvent({
      delay: 7000,
      callback: this.createBaldeBalas,
      callbackScope: this,
      loop: true,
    });

    // Tecla R para reiniciar
    this.r = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    // Timer cada 1 segundo
    this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });

    // Mostrar puntaje y tiempo restante
    this.scoreText = this.add.text(10, 50, `------- ${this.score} `,{
      fill: "#000000",
    });
    this.lifeText = this.add.text(10, 80, `------ ${this.life}`,{
      fill: "#000000",
    });
    this.balasText = this.add.text(15, 25, `----- ${this.balasDisponibles}`, {
      fill: "#000000",
    });

    this.x = this.add.image(43, 55, "cajapuntos");
    this.x = this.add.image(40, 25, "cajabalas");
    this.x = this.add.image(40, 85, "cajavida");
  }

  collectItem(personaje, recolectable) {
    if (recolectable.texture.key === 'baldebalas') {
      this.balasDisponibles += 20; // Aumentar 20 balas al recoger el balde de balas
      this.balasText.setText(`Balas: ${this.balasDisponibles}`);
    } else {
      this.life -= recolectable.life; // Restar vidas
      this.lifeText.setText(`------ ${this.life}`); // Actualizar texto de vidas
    }

    recolectable.destroy(); // Destruir el recolectable
  
    // Verificar si se acabaron las vidas
    if (this.life <= 0) {
      this.gameOver = true;
      this.scene.start("end", {
        score: this.score,
        gameOver: this.gameOver,
      });
    }
  }

  
  onSecond() {
    if (this.gameOver) return;
  
    const tipos = ["slimeverde", "slimenaranja", "slimerosa", "slimevioleta","slimerojo"];
    const tipo = Phaser.Math.RND.pick(tipos);
  
    let recolectable = this.recolectables.create(Phaser.Math.Between(15, 1150), 0, tipo);
    
    // Asignar puntos y vidas al recolectable
    recolectable.points = this.shapes[tipo]?.points || 0;
    recolectable.life = 1; // Cantidad de vidas que se restan al recogerlo
    
    this.physics.add.collider(recolectable, this.recolectables);
    const rebote = Phaser.Math.FloatBetween(0.4, 0.8);
    recolectable.setBounceY(rebote);
    recolectable.setData("points", this.shapes[tipo]?.points || 0);
  }
  
  createBaldeBalas() {
    if (this.gameOver) return;
    
    let recolectable = this.recolectables.create(Phaser.Math.Between(15, 1150), 0, 'baldebalas');
    
    recolectable.life = 0; // No restar vida al recoger el balde de balas
    recolectable.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  }

  onRecolectableBounced(platforms, recolectable) {
    let points = recolectable.getData("points");
    points -= 5;
    recolectable.setData("points", points);
    if (points <= 0 && recolectable.texture.key !== 'baldebalas') {
      recolectable.destroy();
    }
  }

  disparar(pointer) {
    if (this.gameOver) return;

    //Ver las balas que tiene disponibles y si tiene las resta
    if (this.balasDisponibles > 0) {
      this.balasDisponibles -= 1;
      this.balasText.setText(`Balas: ${this.balasDisponibles}`);

      // Crear bala en la posición del personaje
      let bala = this.balas.create(this.personaje.x, this.personaje.y, 'bala');
      this.physics.add.collider(bala, this.plataformas, this.destruirBala, null, this);
      this.physics.add.collider(bala, this.recolectables, this.destruirRecolectable, null, this);

      // Calcular dirección de la bala hacia el mouse
      let angle = Phaser.Math.Angle.Between(this.personaje.x, this.personaje.y, pointer.worldX, pointer.worldY);
      let velocity = this.physics.velocityFromRotation(angle, 600);
      bala.setVelocity(velocity.x, velocity.y);
    }
  }

  destruirRecolectable(bala, recolectable) {
    // Verificar si el recolectable no es un balde de balas antes de destruirlo
    if (recolectable.texture.key !== 'baldebalas') {
      bala.destroy();
      this.score += recolectable.getData("points");
      recolectable.destroy();
      this.scoreText.setText(`------- ${this.score} `);
      this.splash =  this.physics.add.sprite(bala.x, bala.y, "endsplash");
      this.splash.body.allowGravity = false;
      this.splash.anims.play("endsplash").on("animationcomplete", ()=>{
        this.splash.destroy();
      });
    }
  }

  destruirBala(bala, plataformas) {
    bala.destroy();
    this.splash =  this.physics.add.sprite(bala.x, bala.y, "endsplash");
    this.splash.body.allowGravity = false;
    this.splash.anims.play("endsplash").on("animationcomplete", ()=>{
      this.splash.destroy();
    });
  }

  update() {
    if (this.cursor.left.isDown) {
      this.personaje.setVelocityX(-250);
      this.personaje.anims.play('left', true);
      this.lastDirection = 'left';
    } else if (this.cursor.right.isDown) {
      this.personaje.setVelocityX(250);
      this.personaje.anims.play('right', true);
      this.lastDirection = 'right';
    } else {
      this.personaje.setVelocityX(0);
      if (this.lastDirection === 'left') {
        this.personaje.anims.play('turnLeft');
      } else {
        this.personaje.anims.play('turnRight');
      }
    }

    if (this.gameOver && this.r.isDown) {
      this.scene.restart();
      return;
    }

    // Reiniciar la música al presionar la tecla "R"
    if (Phaser.Input.Keyboard.JustDown(this.r)) {
      if (this.backgroundMusic) {
        this.backgroundMusic.stop();
      }
      this.backgroundMusic = this.sound.add('backmusic', { loop: true, volume: 0.2 });
      this.backgroundMusic.play();
    }
  }
}