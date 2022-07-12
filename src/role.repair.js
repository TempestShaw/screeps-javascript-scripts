// let roleRepair = {
//   /** @param {Creep} creep **/
//   run(creep) {
//     if (creep.memory.repairing && creep.store[RESOURCE_ENERGY] === 0) {
//       creep.memory.repairing = false;
//       creep.say("🔄 harvest");
//     }
//     if (!creep.memory.repairing && creep.store.getFreeCapacity() === 0) {
//       creep.memory.repairing = true;
//       creep.say("🚧 Repair");
//     }

//     if (creep.memory.repairing) {

//     } else {
//       let sources = creep.room.find(FIND_SOURCES);
//       let location = Math.round(Math.random());
//       if (creep.memory.location === undefined) {
//         location = Math.round(Math.random());
//         creep.memory.location = location;
//       } else {
//         location = creep.memory.location;
//       }

//       if (creep.harvest(sources[location]) === ERR_NOT_IN_RANGE) {
//         creep.moveTo(sources[location], { visualizePathStyle: { stroke: "#ffaa00" } });
//       }
//     }
//   }
// };

// export default roleRepair;

let roleRepair = {
  /** @param {Creep} creep **/
  run(creep) {
    let targets = creep.room.find(FIND_STRUCTURES, {
      filter: structure => structure.structureType === STRUCTURE_ROAD && structure.hits < structure.hitsMax
    });
    if (creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.task = "harvesting";
      creep.say("🔄 harvest");
    }
    if (creep.store.getFreeCapacity() === 0 && targets.length > 0) {
      creep.memory.task = "repairing";
      creep.say("🚧 repair");
    }
    if (creep.store.getFreeCapacity() === 0 && targets.length === 0) {
      creep.memory.task = "upgrading";
      creep.say("🚧 upgrade");
    }
    if (creep.memory.task === "upgrading") {
      if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: "#ffffff" } });
      }
    }
    if (creep.memory.task === "repairing") {
      targets.sort((a, b) => a.hits - b.hits);
      if (targets.length) {
        if (creep.repair(targets[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" } });
        }
      }
    }
    if (creep.memory.task === "harvesting") {
      let sources = creep.room.find(FIND_SOURCES);
      let location = Math.round(Math.random());
      if (creep.memory.location === undefined) {
        location = Math.round(Math.random());
        creep.memory.location = location;
      } else {
        location = creep.memory.location;
      }

      if (creep.harvest(sources[location]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[location], { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    }
  }
};

export default roleRepair;
