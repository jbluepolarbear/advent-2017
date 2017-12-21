//html entry point
function puzzleFunction(input) {
    let buffer = _.map(input.split('\n'), (e) => {
        let splits = e.split(' ');
        commandArg = {};
        commandArg.command = splits.shift();
        commandArg.args = splits;
        return commandArg;
    });
    return runProgram(buffer);
}

class ProgramBuffer {
    constructor() {
        this.buffer = [];
        this.sendCount = 0;
        this.waiting = false;
    }

    send(value) {
        this.buffer.push(value);
    }

    receive() {
        if (this.buffer.length > 0) {
            this.waiting = false;
            return this.buffer.shift();
        }
        this.waiting = true;
        return null;
    }
}

class MessageBus {
    constructor(programIds) {
        this.programIds = programIds;
        this.messageBuffers = {};
        for (let pId of this.programIds) {
            this.messageBuffers[pId] = new ProgramBuffer();
        }
    }

    send(programId, val) {
        this.messageBuffers[programId].sendCount += 1;
        for (let pId of this.programIds) {
            if (pId !== programId) {
                this.messageBuffers[pId].send(val);
            }
        }
    }

    receive(programId) {
        return this.messageBuffers[programId].receive();
    }

    deadLock() {
        for (let pId of this.programIds) {
            if (!this.messageBuffers[pId].waiting || this.messageBuffers[pId].buffer.length > 0) {
                return false;
            }
        }
        return true;
    }
}

class ASM {
    constructor(programId, messageBus) {
        this.programId = programId;
        this.programCounter = 0;
        this.messageBus = messageBus;
        this.running = true;
        this.registers = {
            'p': this.programId
        };
        this.commands = {
            'snd': this.send.bind(this),
            'set': this.set.bind(this),
            'add': this.add.bind(this),
            'mul': this.multiply.bind(this),
            'mod': this.modulus.bind(this),
            'rcv': this.receive.bind(this),
            'jgz': this.jumpGreaterThanZero.bind(this)
        };
    }

    getRegisterValue(register) {
        if (register in this.registers) {
            return this.registers[register];
        }
        return 0;
    }

    getValueOrRegisterValue(valOrRegister) {
        let value = parseInt(valOrRegister);
        if (isNaN(value)) {
            value = this.getRegisterValue(valOrRegister);
        }

        return value;
    }

    send(valOrRegister) {
        let value = this.getValueOrRegisterValue(valOrRegister);
        console.log(`${this.programId} ${value}`);
        this.messageBus.send(this.programId, value);
    }

    set(register, valOrRegister) {
        this.registers[register] = this.getValueOrRegisterValue(valOrRegister);
    }

    add(register, valOrRegister) {
        this.set(register, this.getRegisterValue(register) + this.getValueOrRegisterValue(valOrRegister));
    }

    multiply(register, valOrRegister) {
        this.set(register, this.getRegisterValue(register) * this.getValueOrRegisterValue(valOrRegister));
    }

    modulus(register, valOrRegister) {
        this.set(register, this.getRegisterValue(register) % this.getValueOrRegisterValue(valOrRegister));
    }

    receive(register) {
        const value = this.messageBus.receive(this.programId);
        if (value !== null) {
            this.set(register, value);
        } else {
            this.programCounter -= 1;
        }
    }

    jumpGreaterThanZero(register, valOrRegister) {
        let regValue = this.getValueOrRegisterValue(register);
        if (regValue > 0) {
            this.programCounter += this.getValueOrRegisterValue(valOrRegister);
            this.programCounter -= 1;
        }
    }

    *runCommands(commandList) {
        while (this.running && this.programCounter < commandList.length) {
            const commandArg = commandList[this.programCounter];
            this.commands[commandArg.command](...commandArg.args);
            this.programCounter += 1;
            yield;
        }
    }
}

function runProgram(commandList) {
    const messageBus = new MessageBus([0, 1]);
    const asm0 = new ASM(0, messageBus);
    const asm1 = new ASM(1, messageBus);
    const asm0Run = asm0.runCommands(commandList);
    const asm1Run = asm1.runCommands(commandList);
    while (!messageBus.deadLock()) {
        asm0Run.next();
        asm1Run.next();
    }
    return messageBus.messageBuffers[1].sendCount;
}