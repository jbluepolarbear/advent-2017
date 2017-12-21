from collections import namedtuple

class ProgramBuffer:
    def __init__(self):
        self.buffer = []
        self.sendCount = 0
        self.wating = False
    
    def send(self, value):
        self.buffer.append(value)

    def receive(self):
        if len(self.buffer) > 0:
            self.wating = False
            return self.buffer.pop(0)
        self.wating = True
        return None

class MessageBus:
    def __init__(self, programIds):
        self.programIds = programIds
        self.buffers = {}
        for pId in programIds:
            self.buffers[pId] = ProgramBuffer()
    
    def send(self, programId, value):
        self.buffers[programId].sendCount = self.buffers[programId].sendCount + 1
        for pId in self.programIds:
            if pId != programId:
                self.buffers[pId].send(value)

    def receive(self, programId):
        if programId in self.buffers:
            return self.buffers[programId].receive()
        return None

    def deadlock(self):
        for pId in self.programIds:
            if not self.buffers[pId].wating or len(self.buffers[pId].buffer) > 0:
                return False
        return True

class ASM:
    def __init__(self, programId, messageBus):
        self.cmds = {
            'snd': self.sndFunc,
            'set': self.setFunc,
            'add': self.addFunc,
            'mul': self.mulFunc,
            'mod': self.modFunc,
            'rcv': self.rcvFunc,
            'jgz': self.jgzFunc 
        }

        self.programCounter = 0
        self.running = True
        self.programId = programId
        self.register = {
            'p': self.programId
        }
        self.messageBus = messageBus

    def valFromInput(self, inputVal):
        val = None
        if isinstance(inputVal, str):
            val = self.register[inputVal]
        else:
            val = inputVal
        return val

    def getRegVal(self, reg):
        if reg in self.register:
            return self.register[reg]
        return 0

    def sndFunc(self, reg):
        sndVal = self.valFromInput(reg)
        self.messageBus.send(self.programId, sndVal)

    def setFunc(self, reg, val):
        self.register[reg] = self.valFromInput(val)

    def addFunc(self, reg, val):
        self.register[reg] = self.getRegVal(reg) + self.valFromInput(val)

    def mulFunc(self, reg, val):
        self.register[reg] = self.getRegVal(reg) * self.valFromInput(val)

    def modFunc(self, reg, val):
        self.register[reg] = self.getRegVal(reg) % self.valFromInput(val)

    def rcvFunc(self, reg):
        rcvVal = self.messageBus.receive(self.programId)
        if rcvVal is not None:
            self.register[reg] = rcvVal
            return
        self.programCounter = self.programCounter - 1
        return True

    def jgzFunc(self, reg, val):
        regVal = self.valFromInput(reg)
        jmpVal = self.valFromInput(val)
        if regVal > 0:
            self.programCounter = self.programCounter + jmpVal
            self.programCounter = self.programCounter - 1

    def runProgram(self, cmdList):
        self.programCounter = 0
        while self.running and self.programCounter < len(cmdList):
            shouldYield = self.cmds[cmdList[self.programCounter].cmd](*cmdList[self.programCounter].inputs)
            self.programCounter = self.programCounter + 1
            if shouldYield == True:
                yield

CmdLine = namedtuple('cmdLine', ['cmd', 'inputs'])

if __name__ == '__main__':
    if len(sys.argv) > 1:
        cmdList = []
        with open(sys.argv[1], 'r') as iFile:
            for line in iFile.read().splitlines():
                items = line.split(' ')
                inputs = []
                for item in items[1:]:
                    val = item.strip()
                    try:
                        inputs.append(int(val))
                    except:
                        inputs.append(val)
                cmdList.append(CmdLine(items[0], inputs))
        messageBus = MessageBus([0, 1])
        asm0 = ASM(0, messageBus)
        asm1 = ASM(1, messageBus)

        asm0Gen = asm0.runProgram(cmdList)
        asm1Gen = asm1.runProgram(cmdList)
        while not messageBus.deadlock():
            next(asm0Gen)
            next(asm1Gen)
        print('programId:', 0, messageBus.buffers[0].sendCount)
        print('programId:', 1, messageBus.buffers[1].sendCount)


