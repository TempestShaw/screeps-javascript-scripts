let roleAttacker = {
  run(creep) {
    const target = Game.flags.Flag2;
    if (target) {
      if (creep.attack(target) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      }
    }
  }
};

export default roleAttacker;
