const fs = require('node:fs')

// load the image file with arguments

let image

if (process.argv.length === 2) {
  console.error('Expected at least one argument! (image file)')
  process.exit(1)
} else {
  image = process.argv[2]
}

const memory = fs.openSync(image, 'r')

// registers

const R_R0 = 0
const R_R1 = 1
const R_R2 = 2
const R_R3 = 3
const R_R4 = 4
const R_R5 = 5
const R_R6 = 6
const R_R7 = 7
const R_PC = 8 /* program counter */
const R_COND = 9/* condition flag */
const R_COUNT = 10

// registers array

const reg = new Array(R_COUNT).fill(0)

// opcodes

const OP_BR = 0b0000 /* branch */
const OP_ADD = 0b0001 /* add  */
const OP_LD = 0b0010/* load */
const OP_ST = 0b0011/* store */
const OP_JSR = 0b0100 /* jump register */
const OP_AND = 0b0101 /* bitwise and */
const OP_LDR = 0b0110 /* load register */
const OP_STR = 0b0111 /* store register */
const OP_RTI = 0b1000 /* unused */
const OP_NOT = 0b1001 /* bitwise not */
const OP_LDI = 0b1010 /* load indirect */
const OP_STI = 0b1011 /* store indirect */
const OP_JMP = 0b1100 /* jump */
const OP_RES = 0b1101 /* reserved (unused) */
const OP_LEA = 0b1110 /* load effective address */
const OP_TRAP = 0b1111 /* execute trap */

// flags

const FL_POS = 1 << 0 /* P */
const FL_ZRO = 1 << 1 /* Z */
const FL_NEG = 1 << 2 /* N */

// setting the condition flags

reg[R_COND] = FL_ZRO

// setting origin

const PC_START = 0x3000

reg[R_PC] = PC_START

const running = true
while (running) {
  // fetch
  const instr = fetchInstr(memory, reg[R_PC])
  // increments of two bytes for a 16 bit instruction
  reg[R_PC] += 2
  const op = instr >> 12 & 0xF
  // execute
  switch (op) {
    case OP_ADD:
      {
        const dr = (instr >> 9) & 0x7
        const sr1 = (instr >> 6) & 0x7
        if (instr >> 5 & 0x1 === 1) {
          const imm5 = instr & 0x1F
          reg[dr] = reg[sr1] + imm5
        } else {
          const sr2 = instr & 0x7
          reg[dr] = reg[sr1] + reg[sr2]
        }
        updateFlags(dr)
      }
      break
    case OP_AND:
      {

      }
      break
    case OP_NOT:
      break
    case OP_BR:
      break
    case OP_JMP:
      break
    case OP_JSR:
      break
    case OP_LD:
      break
    case OP_LDI:
      break
    case OP_LDR:
      break
    case OP_LEA:
      break
    case OP_ST:
      break
    case OP_STI:
      break
    case OP_STR:
      break
    case OP_TRAP:
      break
    case OP_RES:
    case OP_RTI:
    default:
      console.error('unrecognized opcode')
      break
  }
}

// debug for bytes read
/* console.log(fetchInstr(memory, 0x0000).toString(16))
console.log(fetchInstr(memory, 0x0000))
console.log(fetchInstr(memory, 0x0000) >> 12 & 0xF)
 */
function fetchInstr (memory, pc) {
  const buffer = Buffer.alloc(2)
  fs.readSync(memory, buffer, 0, 2, pc)
  return buffer.readUInt16BE()
}

function updateFlags (r) {
  if (reg[r] === 0) {
    reg[R_COND] = FL_ZRO
  } else if (reg[r] >> 15 === 1) {
    reg[R_COND] = FL_NEG
  } else {
    reg[R_COND] = FL_POS
  }
}
