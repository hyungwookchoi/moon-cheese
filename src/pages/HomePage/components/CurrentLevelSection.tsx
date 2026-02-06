import { Box, Flex, styled } from 'styled-system/jsx';
import { ProgressBar, Spacing, Text } from '@/ui-lib';
import { SuspenseQueries } from '@suspensive/react-query';
import { gradePointQueryOptions, userQueryOptions } from '@/apis/queryOptions';
import { capitalize } from 'es-toolkit/string';
import { Skeleton } from '@/components/Skeleton';
import { AsyncBoundary } from '@/components/AsyncBoundary';
import type { GRADE, GradePoint, User } from '@/apis/schema';

function CurrentLevelSection() {
  return (
    <styled.section css={{ px: 5, py: 4 }}>
      <Text variant="H1_Bold">현재 등급</Text>

      <Spacing size={4} />
      <AsyncBoundary loadingFallback={<CurrentLevelLoader />}>
        <SuspenseQueries queries={[userQueryOptions, gradePointQueryOptions]}>
          {([
            { data: user },
            {
              data: { gradePointList },
            },
          ]) => {
            return (
              <Box bg="background.01_white" css={{ px: 5, py: 4, rounded: '2xl' }}>
                <Flex flexDir="column" gap={2}>
                  <Text variant="H2_Bold">{capitalize(user.grade)}</Text>

                  <ProgressBar
                    value={getProgress({
                      point: user.point,
                      currentGradeMinPoint: getCurrentGradeMinPoint(gradePointList, user.grade),
                      nextGradeMinPoint: getNextGradeMinPoint(gradePointList, user.point),
                    })}
                    size="xs"
                  />

                  <Flex justifyContent="space-between">
                    <Box textAlign="left">
                      <Text variant="C1_Bold">현재 포인트</Text>
                      <Text variant="C2_Regular" color="neutral.03_gray">
                        {user.point}p
                      </Text>
                    </Box>
                    <Box textAlign="right">
                      <Text variant="C1_Bold">다음 등급까지</Text>
                      <Text variant="C2_Regular" color="neutral.03_gray">
                        {getPointsToNextGrade({ user, gradePointList })}p
                      </Text>
                    </Box>
                  </Flex>
                </Flex>
              </Box>
            );
          }}
        </SuspenseQueries>
      </AsyncBoundary>
    </styled.section>
  );
}

export default CurrentLevelSection;

function ascendingByMinPoint(a: GradePoint, b: GradePoint) {
  return a.minPoint - b.minPoint;
}

function getCurrentGradeMinPoint(gradePointList: GradePoint[], grade: GRADE) {
  return gradePointList.find(gradePoint => gradePoint.type === grade)?.minPoint ?? 0;
}

function getNextGradeMinPoint(gradePointList: GradePoint[], point: number) {
  const sortedGradePointList = gradePointList.sort(ascendingByMinPoint);
  const nextGrade = sortedGradePointList.find(({ minPoint }) => minPoint > point);

  return nextGrade?.minPoint ?? 0;
}

function getProgress({
  point,
  currentGradeMinPoint,
  nextGradeMinPoint,
}: {
  point: number;
  currentGradeMinPoint: number;
  nextGradeMinPoint: number;
}) {
  return (point - currentGradeMinPoint) / nextGradeMinPoint - currentGradeMinPoint;
}

function getPointsToNextGrade({ user, gradePointList }: { user: User; gradePointList: GradePoint[] }) {
  const sortedGradePointList = gradePointList.sort(ascendingByMinPoint);
  const nextGradeMinPoint = getNextGradeMinPoint(sortedGradePointList, user.point);

  return nextGradeMinPoint - user.point;
}

function CurrentLevelLoader() {
  return (
    <Box bg="background.01_white" css={{ px: 5, py: 4, rounded: '2xl' }}>
      <Flex flexDir="column" gap={2}>
        <Skeleton w="80px" h="24px" />
        <Skeleton w="full" h="8px" rounded="full" />
        <Flex justifyContent="space-between">
          <Box textAlign="left">
            <Skeleton w="60px" h="14px" mb={1} />
            <Skeleton w="40px" h="12px" />
          </Box>
          <Box textAlign="right">
            <Skeleton w="70px" h="14px" mb={1} />
            <Skeleton w="40px" h="12px" />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
