
    import BaseTowerData from "./baseTowerData";
    import BaseCreepData from "./baseCreepData";
    import {ITowerStrategy} from "./interfaces";
    import PlayState from "./playState";
    import Vec2 from "./vec2";
    import Util from "./util";

	export default class StrategyNearestToBase implements ITowerStrategy
	{
		/**
		 * Nearest enemy to your base, in tower radius
		 */
		constructor()
		{
		}
		
		public find(tower:BaseTowerData):BaseCreepData
		{
			let state:PlayState = tower.state;
			//Find creeps in tower radius
			let creeps:BaseCreepData[] = state.creepManager.collection;
			let availableTargets:BaseCreepData[] = new Array<BaseCreepData>();
			for (let c:number = 0; c < creeps.length; c++)
			{
				let creep:BaseCreepData = creeps[c];
				let distance:Vec2 = Util.distanceVect(tower, creep);
				if (distance.length <= tower.radius + tower.size / 2)
				{
					availableTargets.push(creep);
				}
			}
			
			if (availableTargets.length == 0)
			{
				return null;
			}
			//Find target nearest to base
			let nearestToBase:BaseCreepData;
			for (let i:number = 0; i < availableTargets.length; i++)
			{
				availableTargets[i].calculateRangeToBase(state);
			}
			availableTargets.sort(this.comparator);
			nearestToBase = availableTargets[0];
			return nearestToBase;
        }
        
        comparator(el1:BaseCreepData, el2:BaseCreepData):number {
            //TODO check 
            // return el1.rangeToBase > el2.rangeToBase
            return (el1.rangeToBase - el2.rangeToBase);
        }
	}
