// Importando o módulo readline para interagir com o usuário via linha de comando
const readline = require('readline');

// Criando uma interface readline para entrada/saída
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Definição da classe base Character
class Character {
    constructor(nome, level, exp, hp, dano) {
        // Inicialização das propriedades básicas do personagem
        this.nome = nome;
        this.level = level;
        this.exp = exp;
        this.hp = hp;
        this.hpMax = hp;
        this.dano = dano;
    }

    // Método para subir de nível
    levelUp() {
        if (this.exp >= this.expMax) {
            this.level++;
            this.exp = 0;
            this.expMax *= 2;
            this.hpMax += 20;
        }
    }

    // Método para restaurar HP ao máximo
    resetHp() {
        this.hp = this.hpMax;
    }

    // Método de ataque básico
    attack(target) {
        target.hp -= this.dano;
    }

    // Método para verificar se o personagem está vivo
    isAlive() {
        return this.hp > 0;
    }

    // Método para exibir informações do personagem
    display() {
        return `Nome: ${this.nome} // Level: ${this.level} // Dano: ${this.dano} // HP: ${this.hp}/${this.hpMax} // EXP: ${this.exp}/${this.expMax}`;
    }
}

// Definição da classe Player, que herda de Character
class Player extends Character {
    constructor(nome, level, exp, hp, dano, expMax) {
        super(nome, level, exp, hp, dano);
        this.expMax = expMax;
    }
}

// Definição da classe NPC, que herda de Character
class NPC extends Character {
    constructor(nome, level, exp, hp, dano) {
        super(nome, level, exp, hp, dano);
    }
}

// Definição da classe Guerreiro, que herda de Player
class Guerreiro extends Player {
    constructor(nome, level, exp, hp, dano, expMax, forca) {
        super(nome, level, exp, hp, dano, expMax);
        this.forca = forca;
    }

    // Sobrescrevendo o método de ataque para adicionar força
    attack(target) {
        target.hp -= this.dano + this.forca;
    }
}

// Definição da classe Ladrao, que herda de Player
class Ladrao extends Player {
    constructor(nome, level, exp, hp, dano, expMax, agilidade) {
        super(nome, level, exp, hp, dano, expMax);
        this.agilidade = agilidade;
    }

    // Sobrescrevendo o método de ataque para adicionar chance de dano dobrado
    attack(target) {
        const chance = Math.random();
        if (chance <= this.agilidade) {
            target.hp -= this.dano * 2;
        } else {
            target.hp -= this.dano;
        }
    }
}

// Definição da classe Clerigo, que herda de Player
class Clerigo extends Player {
    constructor(nome, level, exp, hp, dano, expMax, cura) {
        super(nome, level, exp, hp, dano, expMax);
        this.cura = cura;
    }

    // Método para curar o alvo
    heal(target) {
        target.hp += this.cura;
        if (target.hp > target.hpMax) {
            target.hp = target.hpMax;
        }
    }
}

// Função para criar instâncias de jogadores com base na classe escolhida
function createPlayer(className, nome, level, exp, hp, dano, expMax, specialStat) {
    switch (className.toLowerCase()) {
        case 'guerreiro':
            return new Guerreiro(nome, level, exp, hp, dano, expMax, specialStat);
        case 'ladrao':
            return new Ladrao(nome, level, exp, hp, dano, expMax, specialStat);
        case 'clerigo':
            return new Clerigo(nome, level, exp, hp, dano, expMax, specialStat);
        default:
            return null;
    }
}

// Função para criar instâncias de NPCs
function createNPC(nome, level, exp, hp, dano) {
    return new NPC(nome, level, exp, hp, dano);
}

// Função para exibir informações da batalha
function displayBattleInfo(player, npc) {
    console.log(`Player: ${player.hp}/${player.hpMax}`);
    console.log(`NPC ${npc.nome}: ${npc.hp}/${npc.hpMax}`);
    console.log("-----------------");
}

// Função para iniciar uma batalha entre um jogador e um NPC
function battle(player, npc) {
    console.log("A batalha começa...");
    displayBattleInfo(player, npc);
    
    // Solicitação de entrada do jogador para ação
    rl.question('Escolha sua ação (atacar/heal): ', (action) => {
        if (action.toLowerCase() === 'atacar') {
            // Realiza ataque
            player.attack(npc);
            npc.attack(player);
            displayBattleInfo(player, npc);
            // Verifica se o jogador venceu a batalha
            if (player.isAlive()) {
                console.log("Você venceu a batalha!");
                player.exp += npc.exp;
                player.levelUp();
                player.resetHp();
            } else {
                console.log("Você foi derrotado!");
            }
        } else if (action.toLowerCase() === 'heal' && player instanceof Clerigo) {
            // Realiza cura se o jogador for um Clérigo
            player.heal(player);
            npc.attack(player);
            displayBattleInfo(player, npc);
            console.log("Você se curou!");
        } else {
            console.log("Ação inválida!");
        }
        rl.close();
    });
}

// Função para começar o jogo
function startGame() {
    rl.question('Bem-vindo ao RPG! Escolha sua classe (Guerreiro, Ladrao, Clerigo): ', (answer) => {
        const className = answer;
        rl.question('Digite o nome do seu personagem: ', (nome) => {
            player = createPlayer(className, nome, 1, 0, 100, 20, 30, 10); // Valores de exemplo
            console.log(`Você é um ${className} chamado ${nome}.`);
            const npc = createNPC("Orco", 1, 20, 80, 10); // NPC de exemplo
            battle(player, npc);
        });
    });
}

// Inicia o jogo
startGame();
