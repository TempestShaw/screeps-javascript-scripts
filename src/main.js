import "./utils/Whitelist";
import ErrorMapper from "./utils/ErrorMapper";
import roleHarvester from "./role.harvester";
import towers from "./tower";
import roleBuilder from "./role.builder";
import roleUpgrader from "./role.upgrader";
import roleRepair from "./role.repair";
import roleTransferr from "./role.transferr";
import roleAttacker from "./role.attacker";
import roleWander from "./role.wander";

const roles = [
  {
    role: roleHarvester,
    name: "harvester"
  },
  {
    role: roleBuilder,
    name: "builder"
  },
  {
    role: roleUpgrader,
    name: "upgrader"
  },
  {
    role: roleRepair,
    name: "repair"
  },
  {
    role: roleTransferr,
    name: "transferr"
  },
  {
    role: roleAttacker,
    name: "attacker"
  },
  {
    role: roleWander,
    name: "wander"
  }
];

function troops() {
  let harvesters = _.filter(Game.creeps, creep => creep.memory.role === "harvester");
  console.log("Harvesters: " + harvesters.length);

  if (harvesters.length < 2) {
    let newName = "Harvester" + Game.time;
    console.log("Spawning new harvester: " + newName);
    Game.spawns.Spawn1.spawnCreep([WORK, CARRY, MOVE, MOVE, MOVE], newName, {
      memory: { role: "harvester" }
    });
  }
  if (harvesters.length < 9 && harvesters.length >= 2) {
    let newName = "Harvester" + Game.time;
    console.log("Spawning new harvester: " + newName);
    // Game.spawns.Spawn1.spawnCreep([ATTACK, ATTACK, MOVE, ATTACK, ATTACK], "Attacker1", {
    //   memory: { role: "attacker" }
    // });
    // Game.spawns.Spawn1.spawnCreep([WORK, CARRY, MOVE, MOVE, MOVE], newName, {
    //   memory: { role: "transferr" }
    // });
    Game.spawns.Spawn1.spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], newName, {
      memory: { role: "harvester" }
    });
  }
  if (harvesters.length >= 9) {
    let upgraders = _.filter(Game.creeps, creep => creep.memory.role === "upgrader");
    console.log("Upgraders: " + upgraders.length);

    if (upgraders.length < 7) {
      let newName1 = "Upgrader" + Game.time;
      console.log("Spawning new Upgrader: " + newName1);
      Game.spawns.Spawn1.spawnCreep(
        [WORK, CARRY, MOVE, MOVE, MOVE, WORK, CARRY, CARRY, CARRY, WORK, WORK, MOVE],
        newName1,
        {
          memory: { role: "upgrader" }
        }
      );
    }

    let builders = _.filter(Game.creeps, creep => creep.memory.role === "builder");
    console.log("Builders: " + builders.length);

    if (builders.length < 2) {
      let newName2 = "Builder" + Game.time;
      console.log("Spawning new Builder: " + newName2);
      Game.spawns.Spawn1.spawnCreep([WORK, WORK, CARRY, MOVE, MOVE, MOVE, WORK, CARRY, CARRY], newName2, {
        memory: { role: "builder" }
      });
    }

    let repairs = _.filter(Game.creeps, creep => creep.memory.role === "repair");
    console.log("Repairs: " + repairs.length);

    if (repairs.length < 2) {
      let newName3 = "Repair" + Game.time;
      console.log("Spawning new Repair: " + newName3);
      Game.spawns.Spawn1.spawnCreep([WORK, CARRY, MOVE, MOVE, WORK, CARRY, CARRY], newName3, {
        memory: { role: "repair" }
      });
    }
    let wanders = _.filter(Game.creeps, creep => creep.memory.role === "wander");
    console.log("Wanders: " + wanders.length);

    if (wanders.length < 6) {
      let newName4 = "Wander" + Game.time;
      console.log("Spawning new wander: " + newName4);
      Game.spawns.Spawn1.spawnCreep([WORK, CARRY, MOVE, MOVE, MOVE, CARRY, CARRY, WORK], newName4, {
        memory: { role: "wander" }
      });
    }
    let transferrs = _.filter(Game.creeps, creep => creep.memory.role === "transferr");
    console.log("Transferrs: " + transferrs.length);

    if (transferrs.length < 1) {
      let newName0 = "Transferr" + Game.time;
      console.log("Spawning new transferr: " + newName0);
      Game.spawns.Spawn1.spawnCreep([WORK, CARRY, MOVE, MOVE, MOVE, CARRY, CARRY], newName0, {
        memory: { role: "transferr" }
      });
    }
  }
}

export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
  troops();
  if (Game.spawns.Spawn1.spawning) {
    let spawningCreep = Game.creeps[Game.spawns.Spawn1.spawning.name];
    Game.spawns.Spawn1.room.visual.text(
      "🛠️" + spawningCreep.memory.role,
      Game.spawns.Spawn1.pos.x + 1,
      Game.spawns.Spawn1.pos.y,
      { align: "left", opacity: 0.8 }
    );
  }
  if (Game.cpu.bucket === 10000) {
    if (Game.cpu.generatePixel) Game.cpu.generatePixel();
    console.log("Generated pixel");
  }
  for (let name in Game.creeps) {
    let creep = Game.creeps[name];
    const role = roles.find(r => r.name === creep.memory.role);
    role.role.run(creep);
  }
  for (const name in Game.structures) {
    const structure = Game.structures[name];
    if (structure instanceof StructureTower) {
      towers.run(structure);
    }
  }
});
