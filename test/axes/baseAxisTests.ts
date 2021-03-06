///<reference path="../testReference.ts" />
var assert = chai.assert;

describe("BaseAxis", () => {
  it("orientation", () => {
    var scale = new Plottable.Scales.Linear();
    assert.throws(() => new Plottable.Axis(scale, "blargh"), "unsupported");
  });

  it("tickLabelPadding() rejects negative values", () => {
    var scale = new Plottable.Scales.Linear();
    var baseAxis = new Plottable.Axis(scale, "bottom");

    assert.throws(() => baseAxis.tickLabelPadding(-1), "must be positive");
  });

  it("margin() rejects negative values", () => {
    var scale = new Plottable.Scales.Linear();
    var axis = new Plottable.Axis(scale, "right");

    assert.throws(() => axis.margin(-1), "must be positive");
  });

  it("width() + margin()", () => {
    var SVG_WIDTH = 100;
    var SVG_HEIGHT = 500;
    var svg = TestMethods.generateSVG(SVG_WIDTH, SVG_HEIGHT);
    var scale = new Plottable.Scales.Linear();
    var verticalAxis = new Plottable.Axis(scale, "right");
    verticalAxis.renderTo(svg);

    var expectedWidth = verticalAxis.tickLength() + verticalAxis.margin(); // tick length and margin by default
    assert.strictEqual(verticalAxis.width(), expectedWidth, "calling width() with no arguments returns currently used width");

    verticalAxis.margin(20);
    expectedWidth = verticalAxis.tickLength() + verticalAxis.margin();
    assert.strictEqual(verticalAxis.width(), expectedWidth, "changing the margin size updates the width");

    svg.remove();
  });

  it("height() + margin()", () => {
    var SVG_WIDTH = 500;
    var SVG_HEIGHT = 100;
    var svg = TestMethods.generateSVG(SVG_WIDTH, SVG_HEIGHT);
    var scale = new Plottable.Scales.Linear();
    var horizontalAxis = new Plottable.Axis(scale, "bottom");
    horizontalAxis.renderTo(svg);

    var expectedHeight = horizontalAxis.tickLength() + horizontalAxis.margin(); // tick length and margin by default
    assert.strictEqual(horizontalAxis.height(), expectedHeight, "calling height() with no arguments returns currently used height");

    horizontalAxis.margin(20);
    expectedHeight = horizontalAxis.tickLength() + horizontalAxis.margin();
    assert.strictEqual(horizontalAxis.height(), expectedHeight, "changing the margin size updates the height");

    svg.remove();
  });

  it("draws ticks and baseline (horizontal)", () => {
    var SVG_WIDTH = 500;
    var SVG_HEIGHT = 100;
    var svg = TestMethods.generateSVG(SVG_WIDTH, SVG_HEIGHT);
    var scale = new Plottable.Scales.Linear();
    scale.domain([0, 10]);
    scale.range([0, SVG_WIDTH]);
    var baseAxis = new Plottable.Axis(scale, "bottom");
    var tickValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    (<any> baseAxis)._getTickValues = function() { return tickValues; };
    baseAxis.renderTo(svg);

    var tickMarks = svg.selectAll("." + Plottable.Axis.TICK_MARK_CLASS);
    assert.strictEqual(tickMarks[0].length, tickValues.length, "A tick mark was created for each value");
    var baseline = svg.select(".baseline");

    assert.isNotNull(baseline.node(), "baseline was drawn");
    assert.strictEqual(baseline.attr("x1"), "0");
    assert.strictEqual(baseline.attr("x2"), String(SVG_WIDTH));
    assert.strictEqual(baseline.attr("y1"), "0");
    assert.strictEqual(baseline.attr("y2"), "0");

    baseAxis.orientation("top");
    assert.isNotNull(baseline.node(), "baseline was drawn");
    assert.strictEqual(baseline.attr("x1"), "0");
    assert.strictEqual(baseline.attr("x2"), String(SVG_WIDTH));
    assert.strictEqual(baseline.attr("y1"), String(baseAxis.height()));
    assert.strictEqual(baseline.attr("y2"), String(baseAxis.height()));

    svg.remove();
  });

  it("draws ticks and baseline (vertical)", () => {
    var SVG_WIDTH = 100;
    var SVG_HEIGHT = 500;
    var svg = TestMethods.generateSVG(SVG_WIDTH, SVG_HEIGHT);
    var scale = new Plottable.Scales.Linear();
    scale.domain([0, 10]);
    scale.range([0, SVG_HEIGHT]);
    var baseAxis = new Plottable.Axis(scale, "left");
    var tickValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    (<any> baseAxis)._getTickValues = function() { return tickValues; };
    baseAxis.renderTo(svg);

    var tickMarks = svg.selectAll("." + Plottable.Axis.TICK_MARK_CLASS);
    assert.strictEqual(tickMarks[0].length, tickValues.length, "A tick mark was created for each value");
    var baseline = svg.select(".baseline");

    assert.isNotNull(baseline.node(), "baseline was drawn");
    assert.strictEqual(baseline.attr("x1"), String(baseAxis.width()));
    assert.strictEqual(baseline.attr("x2"), String(baseAxis.width()));
    assert.strictEqual(baseline.attr("y1"), "0");
    assert.strictEqual(baseline.attr("y2"), String(SVG_HEIGHT));

    baseAxis.orientation("right");
    assert.isNotNull(baseline.node(), "baseline was drawn");
    assert.strictEqual(baseline.attr("x1"), "0");
    assert.strictEqual(baseline.attr("x2"), "0");
    assert.strictEqual(baseline.attr("y1"), "0");
    assert.strictEqual(baseline.attr("y2"), String(SVG_HEIGHT));

    svg.remove();
  });

  it("tickLength()", () => {
    var SVG_WIDTH = 500;
    var SVG_HEIGHT = 100;
    var svg = TestMethods.generateSVG(SVG_WIDTH, SVG_HEIGHT);
    var scale = new Plottable.Scales.Linear();
    scale.domain([0, 10]);
    scale.range([0, SVG_WIDTH]);
    var baseAxis = new Plottable.Axis(scale, "bottom");
    var tickValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    (<any> baseAxis)._getTickValues = function() { return tickValues; };
    baseAxis.renderTo(svg);
    var secondTickMark = svg.selectAll("." + Plottable.Axis.TICK_MARK_CLASS + ":nth-child(2)");
    assert.strictEqual(secondTickMark.attr("x1"), "50");
    assert.strictEqual(secondTickMark.attr("x2"), "50");
    assert.strictEqual(secondTickMark.attr("y1"), "0");
    assert.strictEqual(secondTickMark.attr("y2"), String(baseAxis.tickLength()));

    baseAxis.tickLength(10);
    assert.strictEqual(secondTickMark.attr("y2"), String(baseAxis.tickLength()), "tick length was updated");

    assert.throws(() => baseAxis.tickLength(-1), "must be positive");

    svg.remove();
  });

  it("endTickLength()", () => {
    var SVG_WIDTH = 500;
    var SVG_HEIGHT = 100;
    var svg = TestMethods.generateSVG(SVG_WIDTH, SVG_HEIGHT);
    var scale = new Plottable.Scales.Linear();
    scale.domain([0, 10]);
    scale.range([0, SVG_WIDTH]);
    var baseAxis = new Plottable.Axis(scale, "bottom");
    var tickValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    (<any> baseAxis)._getTickValues = () => tickValues;
    baseAxis.renderTo(svg);

    var firstTickMark = svg.selectAll("." + Plottable.Axis.END_TICK_MARK_CLASS);
    assert.strictEqual(firstTickMark.attr("x1"), "0");
    assert.strictEqual(firstTickMark.attr("x2"), "0");
    assert.strictEqual(firstTickMark.attr("y1"), "0");
    assert.strictEqual(firstTickMark.attr("y2"), String(baseAxis.endTickLength()));

    baseAxis.endTickLength(10);
    assert.strictEqual(firstTickMark.attr("y2"), String(baseAxis.endTickLength()), "end tick length was updated");

    assert.throws(() => baseAxis.endTickLength(-1), "must be positive");

    svg.remove();
  });

  it("height is adjusted to greater of tickLength or endTickLength", () => {
    var SVG_WIDTH = 500;
    var SVG_HEIGHT = 100;
    var svg = TestMethods.generateSVG(SVG_WIDTH, SVG_HEIGHT);
    var scale = new Plottable.Scales.Linear();
    var baseAxis = new Plottable.Axis(scale, "bottom");
    baseAxis.showEndTickLabels(true);
    baseAxis.renderTo(svg);

    var expectedHeight = Math.max(baseAxis.tickLength(), baseAxis.endTickLength()) + baseAxis.margin();
    assert.strictEqual(baseAxis.height(), expectedHeight, "height should be equal to the maximum of the two");

    baseAxis.tickLength(20);
    assert.strictEqual(baseAxis.height(), 20 + baseAxis.margin(), "height should increase to tick length");

    baseAxis.endTickLength(30);
    assert.strictEqual(baseAxis.height(), 30 + baseAxis.margin(), "height should increase to end tick length");

    baseAxis.tickLength(10);
    assert.strictEqual(baseAxis.height(), 30 + baseAxis.margin(), "height should not decrease");

    svg.remove();
  });

  it("default alignment based on orientation", () => {
    var scale = new Plottable.Scales.Linear();
    var baseAxis = new Plottable.Axis(scale, "bottom");
    assert.strictEqual(baseAxis.yAlignment(), "top", "y alignment defaults to \"top\" for bottom axis");
    baseAxis = new Plottable.Axis(scale, "top");
    assert.strictEqual(baseAxis.yAlignment(), "bottom", "y alignment defaults to \"bottom\" for top axis");
    baseAxis = new Plottable.Axis(scale, "left");
    assert.strictEqual(baseAxis.xAlignment(), "right", "x alignment defaults to \"right\" for left axis");
    baseAxis = new Plottable.Axis(scale, "right");
    assert.strictEqual(baseAxis.xAlignment(), "left", "x alignment defaults to \"left\" for right axis");
  });
});
