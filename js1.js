(function(r, f) {
    var diagram = r.d3
    r.d3.main = f(diagram, diagram)
}(this, function(Collect, Select) {

  return function() {
    var direction = direction,
        html = html,
        node = init(),
        svg = null,
        t = null

    function main(v) {
      svg = getnode(v)
      if (!svg) return
      document.body.appendChild(node)
    }

    main.show = function() {
      var box = Array.prototype.slice.call(arguments)
      if (box[box.length - 1] instanceof SVGElement) t = box.pop()

      var content = html.apply(this, box),
          wordbox   = getwordbox(),
          i       = directions.length,
          coords

      wordbox.html(content)
        .style('opacity', 1).style('pointer-events', 'all')

      while (i--) wordbox.classed(directions[i], false)
      coords = directionCB.get(dir).apply(this)
      wordbox.classed(dir, true)

      return main
    }

    main.hide = function() {
      var wordbox = getwordbox()
      wordbox.style('opacity', 0).style('pointer-events', 'none')
      return main
    }

    main.attr = function(wordbox, v) {
      if (arguments.length < 2 && typeof wordbox === 'string') {
        return getwordbox().attr(wordbox)
      }

      var box =  Array.prototype.slice.call(arguments)
      Select.selection.prototype.attr.apply(getwordbox(), box)
      return main
    }


    main.offset = function(v) {
      if (!arguments.length) return offset
      offset = v == null ? v : f(v)

      return main
    }

    main.html = function(v) {
      if (!arguments.length) return html
      html = v == null ? v : f(v)

      return main
    }


    function direction() { return 'wordbox' }
    function html() { return ' ' }

    var directionCB = Collect.map(),
        directions = directionCB.keys()


    function init() {
      var div = Select.select(document.createElement('div'))

      return div.node()
    }

    function getnode(element) {
      var node = element.node()
      if (!node) return null
      if (node.tagName.toLowerCase() === 'svg') return node
      return node.ownerSVGElement
    }

    function getwordbox() {
      if (node == null) {
        node = init()
        // re-add node to DOM
        document.body.appendChild(node)
      }
      return Select.select(node)
    }

    function f(v) {
      return typeof v === 'function' ? v : function() {
        return v
      }
    }

    return main
  }

}));