use('assigment02');


 
// ============================================================
// TASK 1: EVEN ODD PROGRAM  (collection: numbers)
// ============================================================

db.createCollection('numbers');

db.numbers.insertMany([
  {number: 21956},
  {number:165},
  {number: 2006},
  {number: 859 },
  {number: 101 },
  {number: 0 },
  {number: -20 },
  {number: -7 },
  {number: 20 },
  {number: 39 },
  {number: 11 },
  {number: 50 }

])

// TASK 1 -- Part A
db.numbers.aggregate([
  {
    $set:{
      remainder :{
        $mod :["$number" , 2]
      }
    }
  },
  {
    $project :{
      _id :0 ,
      number : 1,
      remainder :1
    }
  }
])

//TASK 1 -- Part B
db.numbers.aggregate([
    {
    $set:{
      remainder :{
        $mod :["$number" , 2]
      }
    }
  },
  {
  $match:{
    remainder :0
  }
  },
  {
    $sort:{
      number : 1,
    }
  },{
    $project:{
      _id :0 , 
      number : 1 ,
     
    }
  }
  
])

//TASK 1 -- Part C

// NOTE: In MongoDB, $mod gives the remainder with the same sign as the number.
// So for negative odd numbers (like -7), remainder is -1, not 1.
// In Part C, I handled this by matching remainder 1 OR -1.
// In Part D, I treated every number with remainder != 0 as Odd,
// so negative odd numbers are counted correctly too.

db.numbers.aggregate([
{
 $set:{
    remainder :{
      $mod:["$number" , 2]
    }
  }
},
{
$match: {
  $or: [
    { remainder: 1 },
    { remainder: -1 }
  ]
}
},
{
 $sort:{
  number:-1
 }
},{
  $project :{
    _id :0 , 
    number :1
  }
}
 
])


//TASK 1 -- Part D

db.numbers.aggregate([
  {
 $set:{
    remainder :{
      $mod:["$number" , 2]
    }
  }
},
  {
    $set:{
      type:{
        $cond: [ {$eq: ["$remainder", 0]}, "Even", "Odd" ]
      }
    }
  }, {
    $group:{
      _id : "$type",
      totalNumbers:{$sum : 1}
    }
  }
])

//TASK 1 -- Part E
db.numbers.aggregate([
  {
    $set:{
      remainder:{
       $mod:[ "$number" , 2 ]
      }
    }
  },
  {
    $match:{
     remainder: 0 
    }
  },
  {
    $sort:{
      number: -1
    }
  },
   {
    $limit : 3
  },
])

//Challange of Task 1
db.numbers.aggregate([
  {
 $set:{
    remainder :{
      $mod:["$number" , 2]
    }
  }
},
  {
    $set:{
      type:{
        $cond: [ {$eq: ["$remainder", 0]}, "Even", "Odd" ]
      }
    }
  }, {
    $project :{
      _id :0,
      number :1,
      type:1
    }
  }
])


 
// ============================================================
// TASK 2: LEAP YEAR PROGRAM  (collection: years)
// ============================================================

db.createCollection('years');

db.years.insertMany([
  {year: 2024},
  {year: 2023},
  {year: 1900},
  {year: 2000},
  {year: 2100},
  {year: 2400},
  {year: 2016},
  {year: 2019},
  {year: 2028},
  {year: 2021},
  {year: 1800},
  {year: 1600}

])


//TASK 2 -- Part A
db.years.aggregate([
  {
    $set:{
      remainder4:{
        $mod:["$year" , 4]
      }
    }
  },
   {
    $set:{
      remainder100:{
        $mod:["$year" , 100]
      }
    }
  },
   {
    $set:{
      remainder400:{
        $mod:["$year" , 400]
      }
    }
  },{
    $project:{
      _id: 0 ,
      year: 1,
      remainder4 : 1 ,
      remainder100 : 1 ,
      remainder400 : 1
    }
  }

])

//TASK 2 --Part B


// Logic:
// leap year = (year % 400 == 0) OR (year % 4 == 0 AND year % 100 != 0)
// $or  -> "this or that": either divisible by 400, or the second condition
// $and -> "this and that": divisible by 4 AND not divisible by 100
// $ne  -> used for "not divisible by 100" (remainder100 != 0)
// So 1900 and 2100 are excluded (divisible by 100 but not by 400),
// while 2000 and 2400 are included (divisible by 400).

db.years.aggregate([
   {
    $set: {
      remainder4: { $mod: ["$year", 4] },
      remainder100: { $mod: ["$year", 100] },
      remainder400: { $mod: ["$year", 400] }
    }
  },
  {
    $match:{ $or: [
      { remainder400 : 0 }, {$and: [{remainder4 : 0 },{remainder100: {$ne: 0 } } ]}
    ]
  }
},
{
  $project:{
    _id :0 , 
    year: 1
  }
}
])


//TASK 2 --Part C

db.years.aggregate([
   {
    $set: {
      remainder4: { $mod: ["$year", 4] },
      remainder100: { $mod: ["$year", 100] },
      remainder400: { $mod: ["$year", 400] }
    }
  },
  {
    $match:{ $or: [
      { remainder4 :{$ne : 0 }}, {$and: [{remainder100 : 0 },{remainder400: {$ne: 0 } } ]}
    ]
  }
},
{
  $project:{
    _id :0 , 
    year: 1
  }
}
])

 //TASK 2 --Part D

 db.years.aggregate([
 {
    $set: {
      remainder4: { $mod: ["$year", 4] },
      remainder100: { $mod: ["$year", 100] },
      remainder400: { $mod: ["$year", 400] }
    }
  },
  {
    $set: {
      type: 
      { 
         $cond: [{ $or: [{ $eq: ["$remainder400", 0] }, { $and: [ { $eq: ["$remainder4", 0] },  { $ne: ["$remainder100", 0] } ] }  ] },  "Leap-year", "Non-Leap-year" ]
      }
    }
  },
  {
   $group:{
     _id : "$type",
     totalNumber : {$sum :1}
   }
  }
 ])


//TASK 2 --Part E

db.years.aggregate([
   {
    $set: {
      remainder4: { $mod: ["$year", 4] },
      remainder100: { $mod: ["$year", 100] },
      remainder400: { $mod: ["$year", 400] }
    }
  },
  {
    $match:{ $or: [
      { remainder400 : 0 }, {$and: [{remainder4 : 0 },{remainder100: {$ne: 0 } } ]}
    ]
  }
},
{
  $group:{
    _id : null,
    olderLeapYear :{$min: "$year"},
    latestLeapYear :{$max :"$year"}
  }
}
])

//Challange of Task 2 

db.years.aggregate([
   {
    $set: {
      remainder4: { $mod: ["$year", 4] },
      remainder100: { $mod: ["$year", 100] },
      remainder400: { $mod: ["$year", 400] }
    }
  },
  {
    $set:{
      daysInYear:{
         $cond: [{ $or: [{ $eq: ["$remainder400", 0] }, { $and: [ { $eq: ["$remainder4", 0] },  { $ne: ["$remainder100", 0] } ] }  ] },  366, 365 ]
      }
    }
  },{
    $project:{
    _id :0,
    year:1,
    daysInYear :1
    }

  }
])

// ============================================================
// TASK 3: MARKSHEET (7 SUBJECTS)  (collection: marksheet)
// ============================================================


db.createCollection("marksheet");

db.marksheet.insertMany([
  {
    rollNo: 101,
    name: "Ayesha",
    course: "ADSE",
    accounting: 95,
    statistics: 92,
    banking: 94,
    management: 90,
    auditing: 96,
    businessLaw: 93,
    economics: 91
  },

  {
    rollNo: 102,
    name: "Hamza",
    course: "BBA",
    accounting: 78,
    statistics: 82,
    banking: 75,
    management: 80,
    auditing: 77,
    businessLaw: 81,
    economics: 79
  },

  {
    rollNo: 103,
    name: "Sara",
    course: "BS Accounting",
    accounting: 70,
    statistics: 65,
    banking: 72,
    management: 68,
    auditing: 71,
    businessLaw: 69,
    economics: 75
  },

  {
    rollNo: 104,
    name: "Ali",
    course: "ADSE",
    accounting: 80,
    statistics: 75,
    banking: 85,
    management: 70,
    auditing: 90,
    businessLaw: 80,
    economics: 70
  },

  {
    rollNo: 105,
    name: "Maham",
    course: "BBA",
    accounting: 80,
    statistics: 75,
    banking: 85,
    management: 70,
    auditing: 90,
    businessLaw: 80,
    economics: 70
  },

  {
    rollNo: 106,
    name: "Zain",
    course: "BS Accounting",
    accounting: 65,
    statistics: 38,
    banking: 72,
    management: 60,
    auditing: 55,
    businessLaw: 70,
    economics: 68
  },

  {
    rollNo: 107,
    name: "Hira",
    course: "ADSE",
    accounting: 35,
    statistics: 45,
    banking: 52,
    management: 40,
    auditing: 48,
    businessLaw: 55,
    economics: 50
  },

  {
    rollNo: 108,
    name: "Usman",
    course: "BBA",
    accounting: 25,
    statistics: 30,
    banking: 35,
    management: 28,
    auditing: 32,
    businessLaw: 27,
    economics: 31
  },

  {
    rollNo: 109,
    name: "Iqra",
    course: "BS Accounting",
    accounting: 88,
    statistics: 84,
    banking: 90,
    management: 86,
    auditing: 82,
    businessLaw: 89,
    economics: 85
  },

  {
    rollNo: 110,
    name: "Bilal",
    course: "ADSE",
    accounting: 60,
    statistics: 55,
    banking: 65,
    management: 62,
    auditing: 58,
    businessLaw: 63,
    economics: 57
  }
])

//TASK 3 --Part A

db.marksheet.aggregate([
  {
    $set:{
      totalMarks:{$add:["$accounting" , "$statistics" , "$banking" , "$management" ,"$auditing" , "$businessLaw" , "$economics"]}
    }
  },
  {
    $set:{
      percentage:{
        $round:[
         {  $multiply: [{ $divide: ["$totalMarks", 700] }, 100] } , 2
        ]
      }
    }

  },
  {
    $project:{
      _id :0 ,
       rollNo :1 ,
       name:1 ,
       totalMarks:1 ,
       percentage :1
    }
  }
])

//TASK 3 --Part B
db.marksheet.aggregate([
  {
    $set:{
      totalMarks:{$add:["$accounting" , "$statistics" , "$banking" , "$management" ,"$auditing" , "$businessLaw" , "$economics"]}
    }
  },
  {
    $set:{
      percentage:{
        $round:[
         {  $multiply: [{ $divide: ["$totalMarks", 700] }, 100] } , 2
        ]
      }
    }

  },
  {
    $project:{
      _id :0 ,
       rollNo :1 ,
       name:1 ,
       totalMarks:1 ,
       percentage :1
    }
  },{
    $sort :{
      totalMarks : -1
    }
  }
])


//TASK 3 --Part C
db.marksheet.aggregate([
  {
    $set:{
      totalMarks:{$add:["$accounting" , "$statistics" , "$banking" , "$management" ,"$auditing" , "$businessLaw" , "$economics"]}
    }
  },
  {
    $set:{
      percentage:{
        $round:[
         {  $multiply: [{ $divide: ["$totalMarks", 700] }, 100] } , 2
        ]
      }
    }

  },
  {
    $project:{
      _id :0 ,
       rollNo :1 ,
       name:1 ,
       totalMarks:1 ,
       percentage :1
    }
  },{
    $sort :{
      totalMarks : -1
    }
  },
  {
    $limit : 3
  }
])


//TASK 3 --Part D

// Logic: A student is in this list if he/she failed in AT LEAST ONE subject.
// A single failed subject (marks < 40) is enough, so I used $or:
// accounting < 40 OR statistics < 40 OR ... OR economics < 40.
// $or means "this or that": if any one condition is true, the student matches.
db.marksheet.aggregate([
  {$match: {
    $or:[{accounting:{$lt :40}} ,{statistics:{$lt :40}} , {banking:{$lt :40}} , {management:{$lt :40}} , {auditing:{$lt :40}} , {businessLaw:{$lt :40}} , {economics:{$lt :40}} ]
  }},{
    $project:{
      _id:0,
      name :1, 
      rollNo :1 ,
      course:1
    }
  }
])

//TASK 3 --Part E

// Logic: A student is in this list only if he/she passed ALL 7 subjects
// AND has an overall percentage of 50 or more.
// Here every condition must be true together, so I used $and:
// accounting >= 40 AND statistics >= 40 AND ... AND economics >= 40 AND percentage >= 50.
// $and means "this and that": if even one condition is false, the student is excluded.
//
// Difference between D and E:
// D uses $or with $lt (fail in any one subject is enough).
// E uses $and with $gte (pass in every subject is required).
// In E the conditions are the opposite of D, and $or becomes $and.
db.marksheet.aggregate([
   {
    $set:{
      totalMarks:{$add:["$accounting" , "$statistics" , "$banking" , "$management" ,"$auditing" , "$businessLaw" , "$economics"]}
    }
  },
  {
    $set:{
      percentage:{
        $round:[
         {  $multiply: [{ $divide: ["$totalMarks", 700] }, 100] } , 2
        ]
      }
    }

  },
  {
    $match :{$and :[
     {accounting:{$gte :40 }} , {statistics:{$gte :40 }} , {banking:{$gte :40 }}, {management:{$gte :40 }}, {auditing:{$gte :40 }}, {businessLaw:{$gte :40 }}, {economics:{$gte :40 }}
  , {percentage :{  $gte :50 }}
    ] }
  }
])

//TASK 3 --Part F

db.marksheet.aggregate([
{
    $set:{
      marks:{$add:["$accounting" , "$statistics" , "$banking" , "$management" ,"$auditing" , "$businessLaw" , "$economics"]}
    }
  },
  {
    $group: {
      _id: null,
      totalStudents: {
        $sum: 1
      },
      averageMarks: {
        $avg: "$marks"
      },
      highestMarks: {
        $max: "$marks"
      },
      lowestMarks: {
        $min: "$marks"
      }
    }
  }

])

//TASK 3 --Part G

db.marksheet.aggregate([
    {
    $set:{
      totalMarks:{$add:["$accounting" , "$statistics" , "$banking" , "$management" ,"$auditing" , "$businessLaw" , "$economics"]}
    }
  },
  {
    $set:{
      percentage:{
        $round:[
         {  $multiply: [{ $divide: ["$totalMarks", 700] }, 100] } , 2
        ]
      }
    }

  },
  {
    $group: {
      _id: "$course",

      totalStudents: {
        $sum: 1
      } ,
       averagePercentage: {
         $avg: "$percentage"
        },
        highestTotalMarks: {
          $max: "$totalMarks"
        }
       }
  },
  {
     $sort:{
       averagePercentage :-1
     }
  }
  ])

  //TASK 3 --Part H

  db.marksheet.aggregate([
  {
    $set:{
      totalMarks:{$add:["$accounting" , "$statistics" , "$banking" , "$management" ,"$auditing" , "$businessLaw" , "$economics"]}
    }
  },
 
  {
    $project:{
      _id :0 ,
       rollNo :1 ,
       name:1 ,
       totalMarks:1 ,
    
    }
  },{
    $sort :{
      totalMarks : -1
    }
  },
  {
    $skip: 4 
  },
  {
    $limit:4
  }
])

//Challange Task of part 3


db.marksheet.aggregate([
  {
    $set:{
      totalMarks:{$add:["$accounting" , "$statistics" , "$banking" , "$management" ,"$auditing" , "$businessLaw" , "$economics"]}
    }
  },
  {
    $set:{
      percentage:{
        $round:[
         {  $multiply: [{ $divide: ["$totalMarks", 700] }, 100] } , 2
        ]
      }
    }

  },
  { 
    $set:{
      grade:{
          $switch:{
            branches :[
              {case :  {$gte :["$percentage" , 80]} , then : "A-1"},
              {case : { $and :[{$gte:["$percentage" , 70]} , {$lte:["$percentage" ,  79.99]}]},  then : "A"},
              {case : { $and :[{$gte:["$percentage" , 60]} , {$lte:["$percentage" ,  69.99]}]},  then : "B"},
              {case : { $and :[{$gte:["$percentage" , 50]} , {$lte:["$percentage" ,  59.99]}]},  then : "C"},
              {case : { $and :[{$gte:["$percentage" , 40]} , {$lte:["$percentage" ,  49.99]}]},  then : "D"}
        
      ],
      default : "F"
    }
      }
    }
  
  },
  {
    $project:{
      _id :0 ,
       rollNo :1 ,
       name:1 ,
       totalMarks:1 ,
       percentage :1,
       grade : 1
    }
  },{
    $sort :{
      totalMarks : -1
    }
  }
])

// ============================================================
// TASK 4: INVENTORY MANAGEMENT SYSTEM  (collection: inventory)
// ============================================================

db.createCollection("inventory");



db.inventory.insertMany([
  {
    itemCode: "ITM-001",
    itemName: "Wireless Mouse",
    category: "Accessories",
    quantity: 45,
    unitPrice: 1200,
    reorderLevel: 20,
    supplier: "TechSource"
  },
  {
    itemCode: "ITM-002",
    itemName: "Mechanical Keyboard",
    category: "Accessories",
    quantity: 15,
    unitPrice: 4500,
    reorderLevel: 15,
    supplier: "TechSource"
  },
  {
    itemCode: "ITM-003",
    itemName: "USB Cable",
    category: "Accessories",
    quantity: 0,
    unitPrice: 250,
    reorderLevel: 10,
    supplier: "CableWorld"
  },
  {
    itemCode: "ITM-004",
    itemName: "Gaming Headset",
    category: "Accessories",
    quantity: 8,
    unitPrice: 6500,
    reorderLevel: 12,
    supplier: "SoundPro"
  },
  {
    itemCode: "ITM-005",
    itemName: "Office Chair",
    category: "Furniture",
    quantity: 12,
    unitPrice: 18000,
    reorderLevel: 5,
    supplier: "ComfortFurnish"
  },
  {
    itemCode: "ITM-006",
    itemName: "Office Desk",
    category: "Furniture",
    quantity: 0,
    unitPrice: 35000,
    reorderLevel: 3,
    supplier: "ComfortFurnish"
  },
  {
    itemCode: "ITM-007",
    itemName: "LED Monitor",
    category: "Electronics",
    quantity: 18,
    unitPrice: 32000,
    reorderLevel: 8,
    supplier: "TechSource"
  },
  {
    itemCode: "ITM-008",
    itemName: "Laser Printer",
    category: "Electronics",
    quantity: 4,
    unitPrice: 55000,
    reorderLevel: 5,
    supplier: "PrintZone"
  },
  {
    itemCode: "ITM-009",
    itemName: "Laptop",
    category: "Electronics",
    quantity: 10,
    unitPrice: 180000,
    reorderLevel: 4,
    supplier: "TechSource"
  },
  {
    itemCode: "ITM-010",
    itemName: "Notebook",
    category: "Stationery",
    quantity: 100,
    unitPrice: 100,
    reorderLevel: 25,
    supplier: "PaperPlus"
  },
  {
    itemCode: "ITM-011",
    itemName: "Ballpoint Pen",
    category: "Stationery",
    quantity: 200,
    unitPrice: 30,
    reorderLevel: 50,
    supplier: "PaperPlus"
  },
  {
    itemCode: "ITM-012",
    itemName: "Projector",
    category: "Presentation",
    quantity: 6,
    unitPrice: 95000,
    reorderLevel: 2,
    supplier: "VisualTech"
  }
]);

//PART 1 --Operations 

// (1)
db.inventory.insertOne({
  itemCode: "ITM-013",
  itemName: "Webcam",
  category: "Electronics",
  quantity: 3,
  unitPrice: 8500,
  reorderLevel: 5,
  supplier: "VisionTech"
})

// (2)
db.inventory.updateOne({ itemCode: "ITM-001" }, { $inc: { quantity: -3 } })

//(3)
db.inventory.updateOne({itemCode : "ITM-008"} , {$inc :{quantity :50}})


// (4) Price increase
// updateMany + $mul CHANGES the stored data permanently.
// Use update commands when the price really has to change in the database.
db.inventory.updateMany({category :"Stationery"} , {$mul:{unitPrice : 1.05} })


// (5) Upsert with an existing itemCode: ITM-012 exists, so it is updated.
db.inventory.updateOne(
  {
    itemCode :"ITM-012"
  }, {
    $set:{
      quantity : 6 , 
      reorderLevel : 1 ,
      supplier : "SmartVision"
    }
  },
  {
    upsert :true
  }
)

// (5) Upsert with a new itemCode: ITM-014 does not exist, so it is inserted as a new item.
db.inventory.updateOne(
  {
    itemCode :"ITM-014"
  }, {
    $set:{
      itemCode: "ITM-014",
      itemName: "USB Hub",
      category: "Accessories",
      quantity: 6,
      unitPrice: 1800,
      reorderLevel: 2,
      supplier: "SmartVision"
    }
  },
  {
    upsert :true
  }
)


//(6)
db.inventory.deleteOne({itemCode : "ITM-014"})


//PART 2 --Reports

//Report A
db.inventory.aggregate([
  {
    $set:{
      stockValue:{
        $multiply :["$unitPrice" , "$quantity"]
      }
    }
  },
  {
    $project :{
      _id :0,
      itemName :1 ,
      quantity :1 , 
      unitPrice:1,
      stockValue:1
    }
  }
])

//Report B
db.inventory.aggregate([
  {$group:
    { 
      _id :0,
      totalInventoryValue:{
      $sum:{
      $multiply :["$unitPrice" , "$quantity"]
       }
      }
    }
  }
  
])


//Report C
db.inventory.aggregate([
  {
    $set:{
      stockValue:{
        $multiply :["$unitPrice" , "$quantity"]
      }
    }
  },
  {
    $group :{
      _id:"$category",
      totalItem: {$sum: 1}, 
      totalQuantityInStock : {$sum:"$quantity"},
      averagePrice :{$avg: "$unitPrice"},
      highestAveragePrice :{$max: "$unitPrice"},
      lowestAveragePrice :{$min:"$unitPrice"},
      totalStockValue :{$sum:"$stockValue"}
    }
  },
  {
    $sort:{
      totalStockValue :-1
    }
  }
])

//Report D


db.inventory.aggregate([
  {
    $set:{shortage:{
      $subtract :["$reorderLevel" , "$quantity"]
    }
     
    }
  },{
    $match:{
      $expr:{
       $lte:["$quantity" , "$reorderLevel"]}
      }
    },
    {
      $project:{
        itemName:1,
        quantity:1,
        reorderLevel :1,
        shortage:1
      }
    }
  
])

//Report E
db.inventory.aggregate([
  { $match: { quantity: 0} },
  {
    $project:{
      _id :0,
      itemCode :1,
      itemName :1
    }
  }
])


//Report F
db.inventory.aggregate([
  {
    $set:{
      stockValue:{
        $multiply :["$unitPrice" , "$quantity"]
      }
    }
  },
  {
    $sort:{
      stockValue :-1
    }
  } ,{
    $project:{
    _id :0,
    itemName :1 ,
    quantity:1,
    unitPrice :1,
    stockValue :1
    }
  },
  {
    $limit :5
  }
])

//Report G
// aggregate() + $set only calculates discountedPrice in the output.
// The documents stored in the collection are NOT changed.
// Use aggregate() for reports and previews.

db.inventory.aggregate([
  {
    $set:{
      discountedPrice:{
        $round:[{
          $subtract:[
            "$unitPrice" ,  {$divide:[{$multiply:["$unitPrice" , 10]} , 100]}
          ]
        }
         ,0
        ] 
      }
    }
  }
])

//PROVE: 
// Answer: No, this has not changed the prices stored in the collection.
// The result of aggregate() is temporary. find() proves that unitPrice is unchanged.
db.inventory.find()


//Report H
db.inventory.aggregate([
  {
    $sort:{
      itemName: 1
    }
  },{
    $skip : 5
  },{
    $limit :5
  }
])


//Challange Task of part 4
db.inventory.aggregate([
 {
    $set:{
      stockValue:{
        $multiply :["$unitPrice" , "$quantity"]
      }
    }
  },
  {
    $group :{
      _id:"$category",
      totalStockValue :{$sum:"$stockValue"}
    }
  },
  {
    $sort:{
      totalStockValue :-1
    }
  } ,{
    $limit :1
  }
])


// ============================================================
//                      COMPLETED ALL TASKS :)
// ============================================================