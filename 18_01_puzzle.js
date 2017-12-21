function puzzleFunction(input) {
    let buffer = _.map(input.split('\t'), (e) => {
        let splits = e.split(' ');
        commandArg = {};
        commandArg.command = splits.shift();
        commandArg.args = splits;
        return commandArg;
    });
    return runProgram(buffer);
}

class MessageBus {
    constructor(programIds) {
        this.programIds = programIds;
        this.messageBuffers = {};
        for (let pId of this.programIds) {
            this.messageBuffers[pId] = {
                buffer: [],
                sendCount: 0
            };
        }
    }

    send(programId, val) {
        for (let pId of this.programIds) {
            if (pId != programId) {
                this.messageBuffers[pId].buffer.push(val);
                this.messageBuffers[pId].sendCount += 1;
            }
        }
    }

    receive(programId) {
        if (this.messageBuffers[programId].length > 0) {
            return this.messageBuffers[programId].shift();
        } else {
            return null;
        }
    }
}

class ASM {
    constructor(programId, messageBus) {
        this.programId = programId;
        this.programCounter = 0;
        this.messageBus = messageBus;
        this.running = true;
        this.registers = {};
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
        this.set('send', this.getValueOrRegisterValue(valOrRegister));
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
        let regValue = this.getRegisterValue(register);
        if (regValue !== 0) {
            //this.programCounter -= 1;
            this.running = false;
            let value = this.getRegisterValue('send');
            console.log(value);
        }
    }

    jumpGreaterThanZero(register, valOrRegister) {
        let regValue = this.getRegisterValue(register);
        if (regValue > 0) {
            this.programCounter += this.getValueOrRegisterValue(valOrRegister);
            this.programCounter -= 1;
        }
    }

    *runCommands(commandList) {
        while (this.running && this.programCounter < commandList.length) {
            let commandArg = commandList[this.programCounter];
            this.commands[commandArg.command](...commandArg.args);
            this.programCounter += 1;
            yield;
        }
    }
}

function runProgram(commandList) {
    const messageBus = new MessageBus([0, 1]);
    const asm0 = new ASM(0, messageBus);
    //const asm1 = new ASM(1, messageBus);
    const asm0Run = asm0.runCommands(commandList);
    //const asm1Run = asm1.runCommands(commandList);
    while (!asm0Run.next().done);
}