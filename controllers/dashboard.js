const db = require("../utils/db");

async function dashboard(req, res) {
  var date = new Date(),
    y = date.getFullYear(),
    m = date.getMonth(),
    d = date.getDate();
  var firstDay = new Date(y, m, 1); // month
  var lastDay = new Date(y, m + 1, 0); // month
  var today = new Date(y, m, d); //today

  //? Total Signups in current month
  let signups = await db.User.countDocuments({
    createdAt: { $gte: firstDay, $lt: lastDay },
  });

  //? pending Orders
  let pending_orders = await db.Order.countDocuments({
    status: { $lte: 0 },
  });

  //? orders per day
  let orders_day = await db.Order.countDocuments({
    createdAt: { $gte: today },
  });

  //? sales per day - amount
  let sales_day = await db.Order.aggregate([
    {
      $match: { createdAt: { $gte: today } },
    },
    {
      $group: {
        _id: null,
        sales: { $sum: "$grandTotal" },
      },
    },
  ]);

  if (sales_day.length === 0) {
    sales_day = 0;
  } else {
    sales_day = parseFloat(sales_day[0].sales.toFixed(2));
  }

  res.json({
    signups: signups,
    pending_orders: pending_orders,
    orders_day: orders_day,
    sales_day: sales_day,
  });
}
async function graph(req, res) {
  var date = new Date(),
    y = date.getFullYear(),
    m = date.getMonth(),
    d = date.getDate();
  var SixMonthBack = new Date(y, m - 5, 1); // -6 months
  var lastDay = new Date(y, m + 1, 0); // month
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let sales_month = await db.Order.aggregate([
    {
      $match: { createdAt: { $gte: SixMonthBack, $lt: lastDay } },
    },
    {
      $group: {
        _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
        sales: { $sum: "$grandTotal" },
      },
    },
  ]);
  sales_month.sort(function (a, b) {
    return a._id.month - b._id.month;
  });
  sales_month.sort(function (a, b) {
    return a._id.year - b._id.year;
  });
  let sales_month_names = {
    month: [],
    sales: [],
  };
  sales_month.forEach((item) => {
    sales_month_names.month.push(months[item._id.month - 1]);
    sales_month_names.sales.push(parseFloat((item.sales / 1000).toFixed(2)));
  });

  //? Orders per month
  let orders_month = await db.Order.aggregate([
    {
      $match: { createdAt: { $gte: SixMonthBack, $lt: lastDay } },
    },
    {
      $group: {
        _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
  ]);
  orders_month.sort(function (a, b) {
    return a._id.month - b._id.month;
  });
  orders_month.sort(function (a, b) {
    return a._id.year - b._id.year;
  });
  let orders_month_names = {
    month: [],
    count: [],
  };
  orders_month.forEach((item) => {
    orders_month_names.month.push(months[item._id.month - 1]);
    orders_month_names.count.push(item.count);
  });

  res.json({
    sales_month: sales_month_names,
    orders_month: orders_month_names,
  });
}
async function setTax(req, res) {
  let doc_count = await db.Tax.count();
  if (doc_count === 1) {
    let tax_doc = await db.Tax.findOne();
    await db.Tax.findByIdAndUpdate(tax_doc._id, req.body).then(() => {
      res.status(200).json({ msg: "Tax info Updated!" });
    });
  } else {
    await db.Tax.create(req.body).then(() => {
      res.status(200).json({ msg: "Tax info Set!" });
    });
  }
}
async function getTax(req, res) {
  let taxInfo = await db.Tax.findOne();
  res.json(taxInfo);
}

module.exports = {
  dashboard,
  graph,
  setTax,
  getTax,
};
