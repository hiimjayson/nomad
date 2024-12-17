function GridFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="border-2 border-typo-time flex items-center justify-center"
      style={{ aspectRatio: 1 }}
    >
      {children}
    </div>
  );
}
function Grid() {
  return (
    <GridFrame>
      <></>
    </GridFrame>
  );
}

function ListFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-52 border-2 border-typo-time flex items-center justify-center">
      {children}
    </div>
  );
}
function List() {
  return (
    <ListFrame>
      <></>
    </ListFrame>
  );
}

export const PostCard = {
  GridFrame,
  Grid,
  ListFrame,
  List,
};
