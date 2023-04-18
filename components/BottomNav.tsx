const BottomNav = () => {
  function before() {
    const wheelEvt = document.createEvent("MouseEvents") as any;
    wheelEvt.initEvent("wheel", true, true);
    wheelEvt.deltaY = -500;
    document.dispatchEvent(wheelEvt);
  }
  function next() {
    const wheelEvt = document.createEvent("MouseEvents") as any;
    wheelEvt.initEvent("wheel", true, true);
    wheelEvt.deltaY = 500;
    document.dispatchEvent(wheelEvt);
  }
  return (
    <div className="bottomNav">
      <div className="bottomNav-before notouch" onClick={() => before()}>
        ↑
      </div>
      <div>/</div>
      <div className="bottomNav-after notouch" onClick={() => next()}>
        ↓
      </div>
    </div>
  );
};

export default BottomNav;
