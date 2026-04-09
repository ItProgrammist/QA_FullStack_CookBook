using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Enums
{
    public class ProductEnums
    {
        public enum ProductCategory
        {
            Frozen, Meat, Vegetables, Greens, Spices, Cereals, Canned, Liquid, Sweets
        }

        public enum CookingNecessity
        {
            ReadyToEat, SemiFinished, RequiresCooking
        }

        [Flags]
        public enum ProductFlags
        {
            None = 0,
            Vegan = 1,
            GlutenFree = 2,
            SugarFree = 3
        }
    }
}